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

type oneSignalNotificationMarkerInfo struct {
	Status  string
	Attempt int
}

type oneSignalNoNotificationIDError struct {
	body string
}

func (err *oneSignalNoNotificationIDError) Error() string {
	if err.body != "" {
		return "OneSignal accepted request without notification id: " + err.body
	}

	return "OneSignal accepted request without notification id"
}

func loadOneSignalNotificationMarkerInfo(ctx context.Context, config s3BackupConfig, credentials awsCredentials, markerKey string, now time.Time) (oneSignalNotificationMarkerInfo, error) {
	body, exists, err := getS3Object(ctx, config, credentials, markerKey, now)
	if err != nil {
		return oneSignalNotificationMarkerInfo{}, err
	}
	if !exists {
		return oneSignalNotificationMarkerInfo{}, fmt.Errorf("OneSignal notification marker %s disappeared after conflict", markerKey)
	}

	var marker struct {
		Status  string `json:"status"`
		Attempt int    `json:"attempt"`
	}
	if err := json.Unmarshal(body, &marker); err != nil {
		return oneSignalNotificationMarkerInfo{}, fmt.Errorf("failed to decode OneSignal notification marker %s: %w", markerKey, err)
	}

	status := strings.TrimSpace(marker.Status)
	if status == "" {
		return oneSignalNotificationMarkerInfo{}, fmt.Errorf("OneSignal notification marker %s is missing status", markerKey)
	}
	if marker.Attempt < 1 {
		marker.Attempt = 1
	}

	return oneSignalNotificationMarkerInfo{Status: status, Attempt: marker.Attempt}, nil
}

func reserveOneSignalNotificationMarker(ctx context.Context, config s3BackupConfig, credentials awsCredentials, markerKey, source, contentID string, pendingMarkerBody []byte, now time.Time) (bool, bool, int, error) {
	if err := putS3ObjectIfAbsent(ctx, config, credentials, markerKey, pendingMarkerBody, s3JSONContentType, now); err != nil {
		if !errors.Is(err, errS3ObjectAlreadyExists) {
			return false, false, 0, err
		}

		state, err := loadOneSignalNotificationMarkerInfo(ctx, config, credentials, markerKey, now)
		if err != nil {
			return false, false, 0, err
		}

		switch state.Status {
		case oneSignalMarkerStatusPending:
			log.Printf("OneSignal notification marker is pending for %s content %s; retrying notification", source, contentID)
			return false, true, state.Attempt, nil
		case oneSignalMarkerStatusSent:
			log.Printf("OneSignal notification marker is already sent for %s content %s; skipping notification", source, contentID)
			return false, false, 0, nil
		default:
			return false, false, 0, fmt.Errorf("unexpected OneSignal notification marker status %q for %s", state.Status, markerKey)
		}
	}

	return true, true, 1, nil
}

func oneSignalIdempotencyKey(source, contentID string) string {
	return oneSignalIdempotencyKeyForAttempt(source, contentID, 1)
}

func oneSignalIdempotencyKeyForAttempt(source, contentID string, attempt int) string {
	if attempt < 1 {
		attempt = 1
	}

	name := fmt.Sprintf("nextblogapp:%s:first-publish:%s", source, contentID)
	if attempt > 1 {
		name = fmt.Sprintf("%s:attempt:%d", name, attempt)
	}

	hash := sha1.New()
	_, _ = hash.Write(oneSignalIdempotencyNamespace[:])
	_, _ = hash.Write([]byte(name))

	var uuid [16]byte
	copy(uuid[:], hash.Sum(nil))
	uuid[6] = (uuid[6] & 0x0f) | 0x50
	uuid[8] = (uuid[8] & 0x3f) | 0x80

	return fmt.Sprintf("%x-%x-%x-%x-%x", uuid[0:4], uuid[4:6], uuid[6:8], uuid[8:10], uuid[10:16])
}

func oneSignalRetryErrorMessage(err error) string {
	if err == nil {
		return ""
	}

	const maxLength = 500
	message := strings.TrimSpace(err.Error())
	if len(message) <= maxLength {
		return message
	}

	return message[:maxLength] + "..."
}

func setOneSignalPendingMarkerFields(marker map[string]interface{}, attempt int, retryErr error, now time.Time) {
	if attempt < 1 {
		attempt = 1
	}

	marker["createdAt"] = now.UTC().Format(time.RFC3339)
	marker["attempt"] = attempt
	if retryErr != nil {
		marker["lastError"] = oneSignalRetryErrorMessage(retryErr)
		marker["lastErrorAt"] = now.UTC().Format(time.RFC3339)
	}
}

func oneSignalExternalArticleMarkerBody(status string, article ExternalArticleNotification, notificationID string, attempt int, retryErr error, now time.Time) ([]byte, error) {
	marker := map[string]interface{}{
		"status":     status,
		"source":     article.Source,
		"contentId":  article.ContentID,
		"title":      article.Title,
		"articleUrl": article.URL,
		"updatedAt":  now.UTC().Format(time.RFC3339),
	}
	if status == oneSignalMarkerStatusPending {
		setOneSignalPendingMarkerFields(marker, attempt, retryErr, now)
	}
	if notificationID != "" {
		marker["oneSignalNotificationId"] = notificationID
	}

	return json.Marshal(marker)
}

func oneSignalNotificationMarkerBody(status string, payload microCMSWebhookPayload, articleTitle, articleURL, notificationID string, attempt int, retryErr error, now time.Time) ([]byte, error) {
	marker := map[string]interface{}{
		"status":     status,
		"contentId":  payload.ID,
		"api":        payload.API,
		"title":      articleTitle,
		"articleUrl": articleURL,
		"updatedAt":  now.UTC().Format(time.RFC3339),
	}
	if status == oneSignalMarkerStatusPending {
		setOneSignalPendingMarkerFields(marker, attempt, retryErr, now)
	}
	if notificationID != "" {
		marker["oneSignalNotificationId"] = notificationID
	}

	return json.Marshal(marker)
}

func createOneSignalNotificationRequest(ctx context.Context, config oneSignalConfig, source, contentID, articleTitle, articleURL string, attempt int, now time.Time) (*http.Request, error) {
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
		"idempotency_key":   oneSignalIdempotencyKeyForAttempt(source, contentID, attempt),
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

func sendOneSignalNotification(ctx context.Context, config oneSignalConfig, source, contentID, articleTitle, articleURL string, attempt int, now time.Time) (string, error) {
	req, err := createOneSignalNotificationRequest(ctx, config, source, contentID, articleTitle, articleURL, attempt, now)
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

	notificationID := strings.TrimSpace(response.ID)
	if notificationID == "" {
		bodySnippet := strings.TrimSpace(string(body))
		return "", &oneSignalNoNotificationIDError{body: bodySnippet}
	}

	return notificationID, nil
}

func shouldAdvanceOneSignalRetryAttempt(err error) bool {
	var noNotificationIDError *oneSignalNoNotificationIDError
	return errors.As(err, &noNotificationIDError)
}

func notifyExternalArticleFirstPublishWithOneSignal(ctx context.Context, config s3BackupConfig, credentials awsCredentials, oneSignalConfig oneSignalConfig, article ExternalArticleNotification, now time.Time) (OneSignalNotificationResult, error) {
	if strings.TrimSpace(article.Source) == "" || strings.TrimSpace(article.ContentID) == "" || strings.TrimSpace(article.URL) == "" {
		return OneSignalNotificationResult{}, errors.New("source, content ID, and URL are required")
	}

	markerKey := oneSignalNotificationMarkerKey(article.Source, article.ContentID)
	pendingMarkerBody, err := oneSignalExternalArticleMarkerBody(oneSignalMarkerStatusPending, article, "", 1, nil, now)
	if err != nil {
		return OneSignalNotificationResult{}, err
	}

	markerCreated, shouldSend, attempt, err := reserveOneSignalNotificationMarker(ctx, config, credentials, markerKey, article.Source, article.ContentID, pendingMarkerBody, now)
	if err != nil {
		return OneSignalNotificationResult{}, err
	}
	if !shouldSend {
		return OneSignalNotificationResult{MarkerKey: markerKey}, nil
	}

	notificationID, err := sendOneSignalNotification(ctx, oneSignalConfig, article.Source, article.ContentID, article.Title, article.URL, attempt, now)
	if err != nil {
		if shouldAdvanceOneSignalRetryAttempt(err) {
			retryMarkerBody, markerErr := oneSignalExternalArticleMarkerBody(oneSignalMarkerStatusPending, article, "", attempt+1, err, now)
			if markerErr != nil {
				return OneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey}, errors.Join(err, markerErr)
			}
			if _, putErr := putS3Object(ctx, config, credentials, markerKey, retryMarkerBody, s3JSONContentType, nil, now); putErr != nil {
				return OneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey}, errors.Join(err, putErr)
			}
		}
		return OneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey}, err
	}

	sentMarkerBody, err := oneSignalExternalArticleMarkerBody(oneSignalMarkerStatusSent, article, notificationID, 0, nil, now)
	if err != nil {
		return OneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey}, err
	}
	if _, err := putS3Object(ctx, config, credentials, markerKey, sentMarkerBody, s3JSONContentType, nil, now); err != nil {
		return OneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey, NotificationID: notificationID}, err
	}

	return OneSignalNotificationResult{
		Sent:           true,
		MarkerCreated:  markerCreated,
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

	pendingMarkerBody, err := oneSignalNotificationMarkerBody(oneSignalMarkerStatusPending, payload, articleTitle, articleURL, "", 1, nil, now)
	if err != nil {
		return oneSignalNotificationResult{}, err
	}

	markerCreated, shouldSend, attempt, err := reserveOneSignalNotificationMarker(ctx, config, credentials, markerKey, payload.API, payload.ID, pendingMarkerBody, now)
	if err != nil {
		return oneSignalNotificationResult{}, err
	}
	if !shouldSend {
		return oneSignalNotificationResult{MarkerKey: markerKey}, nil
	}

	notificationID, err := sendOneSignalNotification(ctx, oneSignalConfig, payload.API, payload.ID, articleTitle, articleURL, attempt, now)
	if err != nil {
		if shouldAdvanceOneSignalRetryAttempt(err) {
			retryMarkerBody, markerErr := oneSignalNotificationMarkerBody(oneSignalMarkerStatusPending, payload, articleTitle, articleURL, "", attempt+1, err, now)
			if markerErr != nil {
				return oneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey}, errors.Join(err, markerErr)
			}
			if _, putErr := putS3Object(ctx, config, credentials, markerKey, retryMarkerBody, s3JSONContentType, nil, now); putErr != nil {
				return oneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey}, errors.Join(err, putErr)
			}
		}
		return oneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey}, err
	}

	sentMarkerBody, err := oneSignalNotificationMarkerBody(oneSignalMarkerStatusSent, payload, articleTitle, articleURL, notificationID, 0, nil, now)
	if err != nil {
		return oneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey}, err
	}
	if _, err := putS3Object(ctx, config, credentials, markerKey, sentMarkerBody, s3JSONContentType, nil, now); err != nil {
		return oneSignalNotificationResult{MarkerCreated: markerCreated, MarkerKey: markerKey, NotificationID: notificationID}, err
	}

	return oneSignalNotificationResult{
		Sent:           true,
		MarkerCreated:  markerCreated,
		MarkerKey:      markerKey,
		NotificationID: notificationID,
	}, nil
}
