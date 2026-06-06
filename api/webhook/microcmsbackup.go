package webhook

import (
	"bytes"
	"context"
	"crypto/hmac"
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
	"strconv"
	"strings"
	"time"
)

const (
	microCMSBackupFetchLimit     = 100
	microCMSBackupRunTimeout     = 50 * time.Second
	microCMSBackupRequestTimeout = 15 * time.Second
	microCMSBackupContentType    = "text/csv; charset=utf-8"
)

var (
	microCMSBackupHTTPClient = &http.Client{Timeout: microCMSBackupRequestTimeout}
	microCMSBackupAPIBaseURL = "https://%s.microcms.io/api/v1/blog"
	microCMSBackupNow        = time.Now
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
	Success      bool   `json:"success"`
	ArticleCount int    `json:"articleCount"`
	BucketName   string `json:"bucketName"`
	ObjectKey    string `json:"objectKey"`
	SizeBytes    int    `json:"sizeBytes"`
}

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
	apiURL.RawQuery = params.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, apiURL.String(), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-MICROCMS-API-KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	return req, nil
}

func fetchMicroCMSBackupArticles(ctx context.Context, serviceDomain, apiKey string) ([]map[string]interface{}, error) {
	articles := []map[string]interface{}{}

	for offset := 0; ; offset += microCMSBackupFetchLimit {
		req, err := buildMicroCMSBackupRequest(ctx, serviceDomain, apiKey, microCMSBackupFetchLimit, offset)
		if err != nil {
			return nil, err
		}

		resp, err := microCMSBackupHTTPClient.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
			bodySnippet := microCMSBackupResponseBodySnippet(resp)
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

func signS3PutObjectRequest(req *http.Request, credentials awsCredentials, region string, body []byte, now time.Time) {
	amzDate := now.UTC().Format("20060102T150405Z")
	dateStamp := now.UTC().Format("20060102")
	payloadHash := sha256Hex(body)

	req.Header.Set("Content-Type", microCMSBackupContentType)
	req.Header.Set("X-Amz-Content-Sha256", payloadHash)
	req.Header.Set("X-Amz-Date", amzDate)

	canonicalHeaders := "content-type:" + microCMSBackupContentType + "\n" +
		"host:" + req.URL.Host + "\n" +
		"x-amz-content-sha256:" + payloadHash + "\n" +
		"x-amz-date:" + amzDate + "\n"
	signedHeaders := "content-type;host;x-amz-content-sha256;x-amz-date"

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
	endpoint := fmt.Sprintf("https://%s.s3.%s.amazonaws.com%s", config.BucketName, config.Region, s3ObjectPath(objectKey))
	req, err := http.NewRequestWithContext(ctx, http.MethodPut, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	signS3PutObjectRequest(req, credentials, config.Region, body, now)
	return req, nil
}

func uploadMicroCMSBackupToS3(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, body []byte, now time.Time) error {
	req, err := buildS3PutObjectRequest(ctx, config, credentials, objectKey, body, now)
	if err != nil {
		return err
	}

	resp, err := microCMSBackupHTTPClient.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		bodySnippet := microCMSBackupResponseBodySnippet(resp)
		if bodySnippet != "" {
			return fmt.Errorf("S3 returned status %d: %s", resp.StatusCode, bodySnippet)
		}
		return fmt.Errorf("S3 returned status %d", resp.StatusCode)
	}

	closeMicroCMSBackupResponseBody(resp)
	return nil
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
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "MICROCMS_WEBHOOK_SECRET is missing"})
		return
	}

	if !verifyMicroCMSWebhookSignature(body, webhookSecret, r.Header.Get("x-microcms-signature")) {
		writeMicroCMSBackupJSON(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
		return
	}

	serviceDomain := os.Getenv("MICROCMS_SERVICE_DOMAIN")
	apiKey := os.Getenv("MICROCMS_API_KEY")
	if serviceDomain == "" || apiKey == "" {
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "microCMS environment variables missing"})
		return
	}

	s3Config, credentials, err := loadS3BackupConfigFromEnv()
	if err != nil {
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	runContext, cancel := context.WithTimeout(r.Context(), microCMSBackupRunTimeout)
	defer cancel()

	articles, err := fetchMicroCMSBackupArticles(runContext, serviceDomain, apiKey)
	if err != nil {
		if runContext.Err() != nil {
			log.Printf("microCMS backup timed out while fetching articles: %v", runContext.Err())
			writeMicroCMSBackupJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "microCMS backup timed out"})
			return
		}
		log.Printf("Failed to fetch microCMS articles for backup: %v", err)
		writeMicroCMSBackupJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to fetch articles"})
		return
	}

	var csvBuffer bytes.Buffer
	if err := writeMicroCMSBackupCSV(&csvBuffer, articles); err != nil {
		log.Printf("Failed to build microCMS backup CSV: %v", err)
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "failed to build backup csv"})
		return
	}

	now := microCMSBackupNow()
	objectKey := microCMSBackupObjectKey(now)
	csvBody := csvBuffer.Bytes()
	if err := uploadMicroCMSBackupToS3(runContext, s3Config, credentials, objectKey, csvBody, now); err != nil {
		if runContext.Err() != nil {
			log.Printf("microCMS backup timed out while uploading to S3: %v", runContext.Err())
			writeMicroCMSBackupJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "microCMS backup timed out"})
			return
		}
		log.Printf("Failed to upload microCMS backup to S3: %v", err)
		writeMicroCMSBackupJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to upload backup"})
		return
	}

	writeMicroCMSBackupJSON(w, http.StatusOK, microCMSBackupResponse{
		Success:      true,
		ArticleCount: len(articles),
		BucketName:   s3Config.BucketName,
		ObjectKey:    objectKey,
		SizeBytes:    len(csvBody),
	})
}
