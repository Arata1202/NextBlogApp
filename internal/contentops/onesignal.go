package contentops

import (
	"bytes"
	"context"
	"crypto/sha1"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

func loadOneSignalConfigFromEnv() (oneSignalConfig, error) {
	config := oneSignalConfig{
		AppID:      strings.TrimSpace(os.Getenv("ONESIGNAL_APP_ID")),
		RESTAPIKey: strings.TrimSpace(os.Getenv("ONESIGNAL_REST_API_KEY")),
		BaseURL:    strings.TrimRight(strings.TrimSpace(os.Getenv("BASE_URL")), "/"),
		BaseTitle:  strings.TrimSpace(os.Getenv("BASE_TITLE")),
	}

	if config.AppID == "" {
		return oneSignalConfig{}, errors.New("ONESIGNAL_APP_ID environment variable is required")
	}
	if config.RESTAPIKey == "" {
		return oneSignalConfig{}, errors.New("ONESIGNAL_REST_API_KEY environment variable is required")
	}
	if config.BaseURL == "" {
		return oneSignalConfig{}, errors.New("BASE_URL environment variable is required")
	}
	if config.BaseTitle == "" {
		return oneSignalConfig{}, errors.New("BASE_TITLE environment variable is required")
	}

	return config, nil
}

func microCMSArticleURL(baseURL, contentID string) string {
	return strings.TrimRight(baseURL, "/") + "/articles/" + url.PathEscape(contentID)
}

func oneSignalNotificationMarkerKey(source, contentID string) string {
	return fmt.Sprintf("onesignal/notifications/%s/%s.json", source, contentID)
}

func oneSignalIdempotencyKey(source, contentID string) string {
	name := fmt.Sprintf("nextblogapp:%s:first-publish:%s", source, contentID)

	hash := sha1.New()
	_, _ = hash.Write(oneSignalIdempotencyNamespace[:])
	_, _ = hash.Write([]byte(name))

	var uuid [16]byte
	copy(uuid[:], hash.Sum(nil))
	uuid[6] = (uuid[6] & 0x0f) | 0x50
	uuid[8] = (uuid[8] & 0x3f) | 0x80

	return fmt.Sprintf("%x-%x-%x-%x-%x", uuid[0:4], uuid[4:6], uuid[6:8], uuid[8:10], uuid[10:16])
}

func oneSignalExternalArticleMarkerBody(status string, article ExternalArticleNotification, notificationID string, now time.Time) ([]byte, error) {
	marker := map[string]interface{}{
		"status":     status,
		"source":     article.Source,
		"contentId":  article.ContentID,
		"title":      article.Title,
		"articleUrl": article.URL,
		"updatedAt":  now.UTC().Format(time.RFC3339),
	}
	if status == "pending" {
		marker["createdAt"] = now.UTC().Format(time.RFC3339)
	}
	if notificationID != "" {
		marker["oneSignalNotificationId"] = notificationID
	}

	return json.Marshal(marker)
}

func oneSignalNotificationMarkerBody(status string, payload microCMSWebhookPayload, articleTitle, articleURL, notificationID string, now time.Time) ([]byte, error) {
	marker := map[string]interface{}{
		"status":     status,
		"contentId":  payload.ID,
		"api":        payload.API,
		"title":      articleTitle,
		"articleUrl": articleURL,
		"updatedAt":  now.UTC().Format(time.RFC3339),
	}
	if status == "pending" {
		marker["createdAt"] = now.UTC().Format(time.RFC3339)
	}
	if notificationID != "" {
		marker["oneSignalNotificationId"] = notificationID
	}

	return json.Marshal(marker)
}

func createOneSignalNotificationRequest(ctx context.Context, config oneSignalConfig, source, contentID, articleTitle, articleURL string, now time.Time) (*http.Request, error) {
	notificationTitle := articleTitle
	if notificationTitle == "" {
		notificationTitle = "新しい記事"
	}

	requestBody := map[string]interface{}{
		"app_id":            config.AppID,
		"target_channel":    "push",
		"included_segments": []string{oneSignalIncludedSegment},
		"headings":          map[string]string{"ja": "新しい記事", "en": "New article"},
		"contents":          map[string]string{"ja": "「" + notificationTitle + "」を公開しました", "en": "Published: " + notificationTitle},
		"url":               articleURL,
		"data":              map[string]string{"type": "article", "source": source, "articleId": contentID},
		"send_after":        now.Add(oneSignalSendDelay).UTC().Format(time.RFC3339),
		"idempotency_key":   oneSignalIdempotencyKey(source, contentID),
		"ttl":               oneSignalNotificationTTLSeconds,
	}

	body, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, oneSignalAPIURL, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Key "+config.RESTAPIKey)

	return req, nil
}

func sendOneSignalNotification(ctx context.Context, config oneSignalConfig, source, contentID, articleTitle, articleURL string, now time.Time) (string, error) {
	req, err := createOneSignalNotificationRequest(ctx, config, source, contentID, articleTitle, articleURL, now)
	if err != nil {
		return "", err
	}

	resp, err := microCMSBackupHTTPClient.Do(req)
	if err != nil {
		return "", err
	}

	body, readErr := io.ReadAll(io.LimitReader(resp.Body, 4096))
	_ = resp.Body.Close()
	if readErr != nil {
		return "", readErr
	}

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		bodySnippet := strings.TrimSpace(string(body))
		if bodySnippet != "" {
			return "", fmt.Errorf("OneSignal returned status %d: %s", resp.StatusCode, bodySnippet)
		}
		return "", fmt.Errorf("OneSignal returned status %d", resp.StatusCode)
	}

	var response struct {
		ID string `json:"id"`
	}
	if len(body) > 0 {
		if err := json.Unmarshal(body, &response); err != nil {
			return "", err
		}
	}

	return response.ID, nil
}

func notifyExternalArticleFirstPublishWithOneSignal(ctx context.Context, config s3BackupConfig, credentials awsCredentials, oneSignalConfig oneSignalConfig, article ExternalArticleNotification, now time.Time) (OneSignalNotificationResult, error) {
	if strings.TrimSpace(article.Source) == "" || strings.TrimSpace(article.ContentID) == "" || strings.TrimSpace(article.URL) == "" {
		return OneSignalNotificationResult{}, errors.New("source, content ID, and URL are required")
	}

	markerKey := oneSignalNotificationMarkerKey(article.Source, article.ContentID)
	pendingMarkerBody, err := oneSignalExternalArticleMarkerBody("pending", article, "", now)
	if err != nil {
		return OneSignalNotificationResult{}, err
	}

	if err := putS3ObjectIfAbsent(ctx, config, credentials, markerKey, pendingMarkerBody, s3JSONContentType, now); err != nil {
		if errors.Is(err, errS3ObjectAlreadyExists) {
			log.Printf("OneSignal notification marker already exists for %s content %s; skipping notification", article.Source, article.ContentID)
			return OneSignalNotificationResult{MarkerKey: markerKey}, nil
		}
		return OneSignalNotificationResult{}, err
	}

	notificationID, err := sendOneSignalNotification(ctx, oneSignalConfig, article.Source, article.ContentID, article.Title, article.URL, now)
	if err != nil {
		return OneSignalNotificationResult{MarkerCreated: true, MarkerKey: markerKey}, err
	}

	sentMarkerBody, err := oneSignalExternalArticleMarkerBody("sent", article, notificationID, now)
	if err != nil {
		return OneSignalNotificationResult{MarkerCreated: true, MarkerKey: markerKey}, err
	}
	if _, err := putS3Object(ctx, config, credentials, markerKey, sentMarkerBody, s3JSONContentType, nil, now); err != nil {
		return OneSignalNotificationResult{MarkerCreated: true, MarkerKey: markerKey, NotificationID: notificationID}, err
	}

	return OneSignalNotificationResult{
		Sent:           true,
		MarkerCreated:  true,
		MarkerKey:      markerKey,
		NotificationID: notificationID,
	}, nil
}

func NotifyExternalArticlesFirstPublishWithOneSignal(ctx context.Context, articles []ExternalArticleNotification, now time.Time) ([]OneSignalNotificationResult, error) {
	if len(articles) == 0 {
		return []OneSignalNotificationResult{}, nil
	}

	oneSignalConfig, err := loadOneSignalConfigFromEnv()
	if err != nil {
		return nil, err
	}

	s3Config, credentials, err := loadS3BackupConfigFromEnv()
	if err != nil {
		return nil, err
	}

	results := make([]OneSignalNotificationResult, 0, len(articles))
	for _, article := range articles {
		result, err := notifyExternalArticleFirstPublishWithOneSignal(ctx, s3Config, credentials, oneSignalConfig, article, now)
		if err != nil {
			if result.MarkerKey != "" {
				results = append(results, result)
			}
			return results, err
		}
		results = append(results, result)
	}

	return results, nil
}

func notifyMicroCMSFirstPublishWithOneSignal(ctx context.Context, config s3BackupConfig, credentials awsCredentials, payload microCMSWebhookPayload, now time.Time) (oneSignalNotificationResult, error) {
	if !isMicroCMSFirstPublishWebhook(payload) {
		return oneSignalNotificationResult{}, nil
	}

	oneSignalConfig, err := loadOneSignalConfigFromEnv()
	if err != nil {
		return oneSignalNotificationResult{}, err
	}

	articleTitle := microCMSWebhookArticleTitle(payload)
	articleURL := microCMSArticleURL(oneSignalConfig.BaseURL, payload.ID)
	markerKey := oneSignalNotificationMarkerKey(payload.API, payload.ID)

	pendingMarkerBody, err := oneSignalNotificationMarkerBody("pending", payload, articleTitle, articleURL, "", now)
	if err != nil {
		return oneSignalNotificationResult{}, err
	}

	if err := putS3ObjectIfAbsent(ctx, config, credentials, markerKey, pendingMarkerBody, s3JSONContentType, now); err != nil {
		if errors.Is(err, errS3ObjectAlreadyExists) {
			log.Printf("OneSignal notification marker already exists for microCMS content %s; skipping notification", payload.ID)
			return oneSignalNotificationResult{MarkerKey: markerKey}, nil
		}
		return oneSignalNotificationResult{}, err
	}

	notificationID, err := sendOneSignalNotification(ctx, oneSignalConfig, payload.API, payload.ID, articleTitle, articleURL, now)
	if err != nil {
		return oneSignalNotificationResult{MarkerCreated: true, MarkerKey: markerKey}, err
	}

	sentMarkerBody, err := oneSignalNotificationMarkerBody("sent", payload, articleTitle, articleURL, notificationID, now)
	if err != nil {
		return oneSignalNotificationResult{MarkerCreated: true, MarkerKey: markerKey}, err
	}
	if _, err := putS3Object(ctx, config, credentials, markerKey, sentMarkerBody, s3JSONContentType, nil, now); err != nil {
		return oneSignalNotificationResult{MarkerCreated: true, MarkerKey: markerKey, NotificationID: notificationID}, err
	}

	return oneSignalNotificationResult{
		Sent:           true,
		MarkerCreated:  true,
		MarkerKey:      markerKey,
		NotificationID: notificationID,
	}, nil
}
