package webhook

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha1"
	"crypto/sha256"
	"encoding/csv"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"NextBlogApp/api/monitoring"
)

const (
	microCMSBackupFields            = "id,title,description,categories,tags,thumbnail,introduction_blocks,content_blocks,related_articles,publishedAt,updatedAt"
	microCMSBackupFetchLimit        = 20
	microCMSBackupMinimumFetchLimit = 1
	microCMSBackupRunTimeout        = 50 * time.Second
	microCMSBackupRequestTimeout    = 15 * time.Second
	microCMSBackupContentType       = "text/csv; charset=utf-8"
	s3JSONContentType               = "application/json; charset=utf-8"
	oneSignalSendDelay              = 5 * time.Minute
	oneSignalNotificationTTLSeconds = 24 * 60 * 60
	oneSignalAPIURL                 = "https://api.onesignal.com/notifications"
	oneSignalIncludedSegment        = "Subscribed Users"
)

var (
	microCMSBackupHTTPClient = &http.Client{Timeout: microCMSBackupRequestTimeout}
	microCMSBackupAPIBaseURL = "https://%s.microcms.io/api/v1/blog"
	microCMSBackupNow        = time.Now
	errS3ObjectAlreadyExists = errors.New("s3 object already exists")

	oneSignalIdempotencyNamespace = [16]byte{0x6b, 0xa7, 0xb8, 0x10, 0x9d, 0xad, 0x11, 0xd1, 0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8}
)

type microCMSBackupListResponse struct {
	Contents   []map[string]interface{} `json:"contents"`
	TotalCount int                      `json:"totalCount"`
	Offset     int                      `json:"offset"`
	Limit      int                      `json:"limit"`
}

type awsCredentials struct {
	AccessKeyID     string
	SecretAccessKey string
}

type s3BackupConfig struct {
	BucketName string
	Region     string
}

type microCMSBackupResponse struct {
	Success                   bool   `json:"success"`
	ArticleCount              int    `json:"articleCount"`
	BucketName                string `json:"bucketName"`
	ObjectKey                 string `json:"objectKey"`
	SizeBytes                 int    `json:"sizeBytes"`
	OneSignalNotificationSent bool   `json:"oneSignalNotificationSent"`
	OneSignalMarkerKey        string `json:"oneSignalMarkerKey,omitempty"`
	OneSignalNotificationID   string `json:"oneSignalNotificationId,omitempty"`
}

type microCMSWebhookPayload struct {
	Service  string                       `json:"service"`
	API      string                       `json:"api"`
	ID       string                       `json:"id"`
	Type     string                       `json:"type"`
	Contents *microCMSWebhookPayloadState `json:"contents"`
}

type microCMSWebhookPayloadState struct {
	Old *microCMSWebhookContentState `json:"old"`
	New *microCMSWebhookContentState `json:"new"`
}

type microCMSWebhookContentState struct {
	Status       []string               `json:"status"`
	PublishValue map[string]interface{} `json:"publishValue"`
	DraftValue   map[string]interface{} `json:"draftValue"`
}

type oneSignalConfig struct {
	AppID      string
	RESTAPIKey string
	BaseURL    string
	BaseTitle  string
}

type ExternalArticleNotification struct {
	Source    string
	ContentID string
	Title     string
	URL       string
}

type OneSignalNotificationResult struct {
	Sent           bool
	MarkerCreated  bool
	MarkerKey      string
	NotificationID string
}

type oneSignalNotificationResult = OneSignalNotificationResult

func writeMicroCMSBackupJSON(w http.ResponseWriter, statusCode int, response interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Failed to encode microCMS backup response: %v", err)
	}
}

func closeMicroCMSBackupResponseBody(resp *http.Response) {
	if resp == nil || resp.Body == nil {
		return
	}

	_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 1024))
	_ = resp.Body.Close()
}

func microCMSBackupResponseBodySnippet(resp *http.Response) string {
	if resp == nil || resp.Body == nil {
		return ""
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, 2048))
	_ = resp.Body.Close()
	if err != nil {
		return ""
	}

	return strings.TrimSpace(string(body))
}

func microCMSBackupStringValue(value interface{}) string {
	text, ok := value.(string)
	if !ok {
		return ""
	}

	return text
}

func microCMSBackupFirstString(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}

	return ""
}

func microCMSWebhookStatusIncludes(state *microCMSWebhookContentState, status string) bool {
	if state == nil {
		return false
	}

	for _, currentStatus := range state.Status {
		if strings.EqualFold(currentStatus, status) {
			return true
		}
	}

	return false
}

func isMicroCMSFirstPublishWebhook(payload microCMSWebhookPayload) bool {
	if payload.API != "blog" || strings.TrimSpace(payload.ID) == "" || payload.Type == "delete" || payload.Contents == nil {
		return false
	}

	oldPublished := microCMSWebhookStatusIncludes(payload.Contents.Old, "PUBLISH")
	newPublished := microCMSWebhookStatusIncludes(payload.Contents.New, "PUBLISH")

	return !oldPublished && newPublished
}

func microCMSWebhookPublishedValue(payload microCMSWebhookPayload) map[string]interface{} {
	if payload.Contents == nil || payload.Contents.New == nil {
		return nil
	}

	if payload.Contents.New.PublishValue != nil {
		return payload.Contents.New.PublishValue
	}

	return payload.Contents.New.DraftValue
}

func microCMSWebhookArticleTitle(payload microCMSWebhookPayload) string {
	publishedValue := microCMSWebhookPublishedValue(payload)
	if publishedValue == nil {
		return ""
	}

	return strings.TrimSpace(microCMSBackupStringValue(publishedValue["title"]))
}

func normalizeMicroCMSServiceDomain(value string) (string, error) {
	serviceDomain := strings.TrimSpace(value)
	if serviceDomain == "" {
		return "", errors.New("MICROCMS_SERVICE_DOMAIN environment variable is required")
	}

	if strings.Contains(serviceDomain, "://") {
		parsedURL, err := url.Parse(serviceDomain)
		if err != nil || parsedURL.Host == "" {
			return "", errors.New("MICROCMS_SERVICE_DOMAIN must be a microCMS service domain")
		}
		serviceDomain = parsedURL.Host
	} else if slashIndex := strings.IndexAny(serviceDomain, "/\\"); slashIndex >= 0 {
		serviceDomain = serviceDomain[:slashIndex]
	}

	serviceDomain = strings.TrimSuffix(serviceDomain, ".microcms.io")
	if serviceDomain == "" || strings.ContainsAny(serviceDomain, "/\\") {
		return "", errors.New("MICROCMS_SERVICE_DOMAIN must be a microCMS service domain")
	}

	return serviceDomain, nil
}

func buildMicroCMSBackupRequest(ctx context.Context, serviceDomain, apiKey string, limit, offset int) (*http.Request, error) {
	normalizedServiceDomain, err := normalizeMicroCMSServiceDomain(serviceDomain)
	if err != nil {
		return nil, err
	}

	apiURL, err := url.Parse(fmt.Sprintf(microCMSBackupAPIBaseURL, normalizedServiceDomain))
	if err != nil {
		return nil, err
	}

	params := apiURL.Query()
	params.Set("limit", strconv.Itoa(limit))
	params.Set("offset", strconv.Itoa(offset))
	params.Set("fields", microCMSBackupFields)
	apiURL.RawQuery = params.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, apiURL.String(), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-MICROCMS-API-KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	return req, nil
}

func microCMSBackupResponseTooLarge(statusCode int, bodySnippet string) bool {
	return statusCode == http.StatusBadRequest &&
		strings.Contains(strings.ToLower(bodySnippet), "response body size is too long")
}

func nextMicroCMSBackupFetchLimit(currentLimit int) int {
	nextLimit := currentLimit / 2
	if nextLimit < microCMSBackupMinimumFetchLimit {
		return microCMSBackupMinimumFetchLimit
	}

	return nextLimit
}

func fetchMicroCMSBackupArticles(ctx context.Context, serviceDomain, apiKey string) ([]map[string]interface{}, error) {
	articles := []map[string]interface{}{}
	limit := microCMSBackupFetchLimit

	for offset := 0; ; {
		req, err := buildMicroCMSBackupRequest(ctx, serviceDomain, apiKey, limit, offset)
		if err != nil {
			return nil, err
		}

		resp, err := microCMSBackupHTTPClient.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
			bodySnippet := microCMSBackupResponseBodySnippet(resp)
			if microCMSBackupResponseTooLarge(resp.StatusCode, bodySnippet) && limit > microCMSBackupMinimumFetchLimit {
				limit = nextMicroCMSBackupFetchLimit(limit)
				log.Printf("microCMS backup response was too large at offset %d; retrying with limit %d", offset, limit)
				continue
			}
			if bodySnippet != "" {
				return nil, fmt.Errorf("microCMS backup returned status %d: %s", resp.StatusCode, bodySnippet)
			}
			return nil, fmt.Errorf("microCMS backup returned status %d", resp.StatusCode)
		}

		var listResponse microCMSBackupListResponse
		if err := json.NewDecoder(resp.Body).Decode(&listResponse); err != nil {
			closeMicroCMSBackupResponseBody(resp)
			return nil, err
		}
		closeMicroCMSBackupResponseBody(resp)

		articles = append(articles, listResponse.Contents...)
		if len(articles) >= listResponse.TotalCount || len(listResponse.Contents) == 0 {
			return articles, nil
		}
		offset += len(listResponse.Contents)
	}
}

func microCMSBackupCSVHeader() []string {
	return []string{
		"コンテンツID\n※空欄で構いません。特定の値を設定したい場合に入力してください。",
		"title",
		"description",
		"categories",
		"tags",
		"thumbnail",
		"introduction_blocks",
		"content_blocks",
		"related_articles",
	}
}

func microCMSReferenceID(value interface{}) string {
	switch typedValue := value.(type) {
	case string:
		return strings.TrimSpace(typedValue)
	case map[string]interface{}:
		return microCMSBackupFirstString(
			microCMSBackupStringValue(typedValue["id"]),
			microCMSBackupStringValue(typedValue["contentId"]),
		)
	default:
		return ""
	}
}

func microCMSReferenceIDsCSVValue(value interface{}) string {
	switch typedValue := value.(type) {
	case nil:
		return ""
	case []interface{}:
		ids := make([]string, 0, len(typedValue))
		for _, item := range typedValue {
			if id := microCMSReferenceID(item); id != "" {
				ids = append(ids, id)
			}
		}
		return strings.Join(ids, ",")
	default:
		return microCMSReferenceID(typedValue)
	}
}

func microCMSImageURLValue(value interface{}) string {
	switch typedValue := value.(type) {
	case string:
		return strings.TrimSpace(typedValue)
	case map[string]interface{}:
		return microCMSBackupFirstString(
			microCMSBackupStringValue(typedValue["url"]),
			microCMSBackupStringValue(typedValue["src"]),
		)
	default:
		return ""
	}
}

func microCMSJSONCSVValue(value interface{}) (string, error) {
	if value == nil {
		return "", nil
	}

	if text, ok := value.(string); ok {
		return strings.TrimSpace(text), nil
	}

	jsonValue, err := json.Marshal(value)
	if err != nil {
		return "", err
	}

	return string(jsonValue), nil
}

func microCMSBackupCSVRow(article map[string]interface{}) ([]string, error) {
	introductionBlocks, err := microCMSJSONCSVValue(article["introduction_blocks"])
	if err != nil {
		return nil, err
	}

	contentBlocks, err := microCMSJSONCSVValue(article["content_blocks"])
	if err != nil {
		return nil, err
	}

	relatedArticles, err := microCMSJSONCSVValue(article["related_articles"])
	if err != nil {
		return nil, err
	}

	return []string{
		microCMSBackupStringValue(article["id"]),
		microCMSBackupStringValue(article["title"]),
		microCMSBackupStringValue(article["description"]),
		microCMSReferenceIDsCSVValue(article["categories"]),
		microCMSReferenceIDsCSVValue(article["tags"]),
		microCMSImageURLValue(article["thumbnail"]),
		introductionBlocks,
		contentBlocks,
		relatedArticles,
	}, nil
}

func writeMicroCMSBackupCSV(writer io.Writer, articles []map[string]interface{}) error {
	csvWriter := csv.NewWriter(writer)

	if err := csvWriter.Write(microCMSBackupCSVHeader()); err != nil {
		return err
	}

	for _, article := range articles {
		row, err := microCMSBackupCSVRow(article)
		if err != nil {
			return err
		}
		if err := csvWriter.Write(row); err != nil {
			return err
		}
	}

	csvWriter.Flush()
	return csvWriter.Error()
}

func loadS3BackupConfigFromEnv() (s3BackupConfig, awsCredentials, error) {
	config := s3BackupConfig{
		BucketName: strings.TrimSpace(os.Getenv("BUCKET_NAME")),
		Region: microCMSBackupFirstString(
			os.Getenv("AWS_REGION"),
			os.Getenv("AWS_DEFAULT_REGION"),
		),
	}
	credentials := awsCredentials{
		AccessKeyID:     strings.TrimSpace(os.Getenv("AWS_ACCESS_KEY_ID")),
		SecretAccessKey: strings.TrimSpace(os.Getenv("AWS_SECRET_ACCESS_KEY")),
	}

	if config.BucketName == "" {
		return s3BackupConfig{}, awsCredentials{}, errors.New("BUCKET_NAME environment variable is required")
	}
	if strings.ContainsAny(config.BucketName, "/\\") {
		return s3BackupConfig{}, awsCredentials{}, errors.New("BUCKET_NAME must be an S3 bucket name, not a path")
	}
	if config.Region == "" {
		return s3BackupConfig{}, awsCredentials{}, errors.New("AWS_REGION or AWS_DEFAULT_REGION environment variable is required")
	}
	if credentials.AccessKeyID == "" || credentials.SecretAccessKey == "" {
		return s3BackupConfig{}, awsCredentials{}, errors.New("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required")
	}

	return config, credentials, nil
}

func microCMSBackupObjectKey(now time.Time) string {
	jst := now.In(time.FixedZone("JST", 9*60*60))

	return fmt.Sprintf(
		"backups/microcms/blog/%04d/%02d/%02d/microcmsblogbackup-%s.csv",
		jst.Year(),
		jst.Month(),
		jst.Day(),
		jst.Format("20060102T150405JST"),
	)
}

func s3ObjectPath(objectKey string) string {
	segments := strings.Split(objectKey, "/")
	escapedSegments := make([]string, 0, len(segments))
	for _, segment := range segments {
		escapedSegments = append(escapedSegments, url.PathEscape(segment))
	}

	return "/" + strings.Join(escapedSegments, "/")
}

func sha256Hex(value []byte) string {
	sum := sha256.Sum256(value)
	return hex.EncodeToString(sum[:])
}

func hmacSHA256(key []byte, value string) []byte {
	mac := hmac.New(sha256.New, key)
	mac.Write([]byte(value))
	return mac.Sum(nil)
}

func awsSigningKey(secretAccessKey, dateStamp, region, service string) []byte {
	dateKey := hmacSHA256([]byte("AWS4"+secretAccessKey), dateStamp)
	dateRegionKey := hmacSHA256(dateKey, region)
	dateRegionServiceKey := hmacSHA256(dateRegionKey, service)
	return hmacSHA256(dateRegionServiceKey, "aws4_request")
}

func normalizeAWSHeaderValue(value string) string {
	return strings.Join(strings.Fields(value), " ")
}

func canonicalS3Headers(req *http.Request) (string, string) {
	headerValues := map[string]string{
		"host": req.URL.Host,
	}

	for name, values := range req.Header {
		if len(values) == 0 {
			continue
		}
		headerValues[strings.ToLower(name)] = normalizeAWSHeaderValue(strings.Join(values, ","))
	}

	headerNames := make([]string, 0, len(headerValues))
	for name := range headerValues {
		headerNames = append(headerNames, name)
	}
	sort.Strings(headerNames)

	canonicalHeaders := strings.Builder{}
	for _, name := range headerNames {
		canonicalHeaders.WriteString(name)
		canonicalHeaders.WriteString(":")
		canonicalHeaders.WriteString(headerValues[name])
		canonicalHeaders.WriteString("\n")
	}

	return canonicalHeaders.String(), strings.Join(headerNames, ";")
}

func signS3PutObjectRequest(req *http.Request, credentials awsCredentials, region string, body []byte, now time.Time) {
	amzDate := now.UTC().Format("20060102T150405Z")
	dateStamp := now.UTC().Format("20060102")
	payloadHash := sha256Hex(body)

	req.Header.Set("X-Amz-Content-Sha256", payloadHash)
	req.Header.Set("X-Amz-Date", amzDate)

	canonicalHeaders, signedHeaders := canonicalS3Headers(req)

	canonicalRequest := strings.Join([]string{
		req.Method,
		req.URL.EscapedPath(),
		"",
		canonicalHeaders,
		signedHeaders,
		payloadHash,
	}, "\n")

	credentialScope := strings.Join([]string{dateStamp, region, "s3", "aws4_request"}, "/")
	stringToSign := strings.Join([]string{
		"AWS4-HMAC-SHA256",
		amzDate,
		credentialScope,
		sha256Hex([]byte(canonicalRequest)),
	}, "\n")

	signature := hex.EncodeToString(hmacSHA256(awsSigningKey(credentials.SecretAccessKey, dateStamp, region, "s3"), stringToSign))
	req.Header.Set(
		"Authorization",
		fmt.Sprintf(
			"AWS4-HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s",
			credentials.AccessKeyID,
			credentialScope,
			signedHeaders,
			signature,
		),
	)
}

func buildS3PutObjectRequest(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, body []byte, now time.Time) (*http.Request, error) {
	return buildS3PutObjectRequestWithHeaders(ctx, config, credentials, objectKey, body, microCMSBackupContentType, nil, now)
}

func buildS3PutObjectRequestWithHeaders(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, body []byte, contentType string, headers http.Header, now time.Time) (*http.Request, error) {
	endpoint := fmt.Sprintf("https://%s.s3.%s.amazonaws.com%s", config.BucketName, config.Region, s3ObjectPath(objectKey))
	req, err := http.NewRequestWithContext(ctx, http.MethodPut, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", contentType)
	for name, values := range headers {
		for _, value := range values {
			req.Header.Add(name, value)
		}
	}
	signS3PutObjectRequest(req, credentials, config.Region, body, now)
	return req, nil
}

func putS3Object(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, body []byte, contentType string, headers http.Header, now time.Time) (int, error) {
	req, err := buildS3PutObjectRequestWithHeaders(ctx, config, credentials, objectKey, body, contentType, headers, now)
	if err != nil {
		return 0, err
	}

	resp, err := microCMSBackupHTTPClient.Do(req)
	if err != nil {
		return 0, err
	}

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		bodySnippet := microCMSBackupResponseBodySnippet(resp)
		if bodySnippet != "" {
			return resp.StatusCode, fmt.Errorf("S3 returned status %d: %s", resp.StatusCode, bodySnippet)
		}
		return resp.StatusCode, fmt.Errorf("S3 returned status %d", resp.StatusCode)
	}

	closeMicroCMSBackupResponseBody(resp)
	return resp.StatusCode, nil
}

func putS3ObjectIfAbsent(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, body []byte, contentType string, now time.Time) error {
	headers := http.Header{}
	headers.Set("If-None-Match", "*")

	statusCode, err := putS3Object(ctx, config, credentials, objectKey, body, contentType, headers, now)
	if err == nil {
		return nil
	}

	if statusCode == http.StatusConflict || statusCode == http.StatusPreconditionFailed {
		return errS3ObjectAlreadyExists
	}

	return err
}

func uploadMicroCMSBackupToS3(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, body []byte, now time.Time) error {
	_, err := putS3Object(ctx, config, credentials, objectKey, body, microCMSBackupContentType, nil, now)
	return err
}

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

func expectedMicroCMSWebhookSignature(body []byte, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	return hex.EncodeToString(mac.Sum(nil))
}

func verifyMicroCMSWebhookSignature(body []byte, secret, signature string) bool {
	signatureBytes, err := hex.DecodeString(strings.TrimSpace(signature))
	if err != nil {
		return false
	}

	expectedSignatureBytes, err := hex.DecodeString(expectedMicroCMSWebhookSignature(body, secret))
	if err != nil {
		return false
	}

	return hmac.Equal(signatureBytes, expectedSignatureBytes)
}

func MicroCMSBackupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeMicroCMSBackupJSON(w, http.StatusMethodNotAllowed, map[string]string{"message": "Method Not Allowed"})
		return
	}

	defer r.Body.Close()
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 1024*1024))
	if err != nil {
		writeMicroCMSBackupJSON(w, http.StatusBadRequest, map[string]string{"message": "invalid webhook body"})
		return
	}

	webhookSecret := os.Getenv("MICROCMS_WEBHOOK_SECRET")
	if webhookSecret == "" {
		monitoring.CaptureError(errors.New("MICROCMS_WEBHOOK_SECRET is missing"), monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "load_webhook_secret",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "MICROCMS_WEBHOOK_SECRET is missing"})
		return
	}

	if !verifyMicroCMSWebhookSignature(body, webhookSecret, r.Header.Get("x-microcms-signature")) {
		writeMicroCMSBackupJSON(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
		return
	}

	var webhookPayload microCMSWebhookPayload
	if err := json.Unmarshal(body, &webhookPayload); err != nil {
		writeMicroCMSBackupJSON(w, http.StatusBadRequest, map[string]string{"message": "invalid webhook json"})
		return
	}

	serviceDomain := os.Getenv("MICROCMS_SERVICE_DOMAIN")
	apiKey := os.Getenv("MICROCMS_API_KEY")
	if serviceDomain == "" || apiKey == "" {
		monitoring.CaptureError(errors.New("microCMS backup environment variables missing"), monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "load_microcms_env",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "microCMS environment variables missing"})
		return
	}

	s3Config, credentials, err := loadS3BackupConfigFromEnv()
	if err != nil {
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "load_s3_env",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	runContext, cancel := context.WithTimeout(r.Context(), microCMSBackupRunTimeout)
	defer cancel()

	articles, err := fetchMicroCMSBackupArticles(runContext, serviceDomain, apiKey)
	if err != nil {
		if runContext.Err() != nil {
			log.Printf("microCMS backup timed out while fetching articles: %v", runContext.Err())
			monitoring.CaptureError(runContext.Err(), monitoring.EventContext{
				Feature:   "microcms_backup",
				Operation: "fetch_microcms_articles",
				Request:   r,
			})
			writeMicroCMSBackupJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "microCMS backup timed out"})
			return
		}
		log.Printf("Failed to fetch microCMS articles for backup: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "fetch_microcms_articles",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to fetch articles"})
		return
	}

	var csvBuffer bytes.Buffer
	if err := writeMicroCMSBackupCSV(&csvBuffer, articles); err != nil {
		log.Printf("Failed to build microCMS backup CSV: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "build_backup_csv",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "failed to build backup csv"})
		return
	}

	now := microCMSBackupNow()
	objectKey := microCMSBackupObjectKey(now)
	csvBody := csvBuffer.Bytes()
	if err := uploadMicroCMSBackupToS3(runContext, s3Config, credentials, objectKey, csvBody, now); err != nil {
		if runContext.Err() != nil {
			log.Printf("microCMS backup timed out while uploading to S3: %v", runContext.Err())
			monitoring.CaptureError(runContext.Err(), monitoring.EventContext{
				Feature:   "microcms_backup",
				Operation: "upload_backup_to_s3",
				Request:   r,
			})
			writeMicroCMSBackupJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "microCMS backup timed out"})
			return
		}
		log.Printf("Failed to upload microCMS backup to S3: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "upload_backup_to_s3",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to upload backup"})
		return
	}

	notificationResult, err := notifyMicroCMSFirstPublishWithOneSignal(runContext, s3Config, credentials, webhookPayload, now)
	if err != nil {
		if runContext.Err() != nil {
			log.Printf("microCMS backup timed out while sending OneSignal notification: %v", runContext.Err())
			monitoring.CaptureError(runContext.Err(), monitoring.EventContext{
				Feature:   "microcms_backup",
				Operation: "send_onesignal_notification",
				Request:   r,
			})
			writeMicroCMSBackupJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "microCMS backup timed out"})
			return
		}
		log.Printf("Failed to send OneSignal notification for microCMS content %s: %v", webhookPayload.ID, err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "send_onesignal_notification",
			Request:   r,
			Extras: map[string]interface{}{
				"content_id": webhookPayload.ID,
			},
		})
		writeMicroCMSBackupJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to send notification"})
		return
	}

	writeMicroCMSBackupJSON(w, http.StatusOK, microCMSBackupResponse{
		Success:                   true,
		ArticleCount:              len(articles),
		BucketName:                s3Config.BucketName,
		ObjectKey:                 objectKey,
		SizeBytes:                 len(csvBody),
		OneSignalNotificationSent: notificationResult.Sent,
		OneSignalMarkerKey:        notificationResult.MarkerKey,
		OneSignalNotificationID:   notificationResult.NotificationID,
	})
}
