package contentops

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"
	"time"
)

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

func signS3ObjectRequest(req *http.Request, credentials awsCredentials, region string, body []byte, now time.Time) {
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
	signS3ObjectRequest(req, credentials, config.Region, body, now)
	return req, nil
}

func buildS3GetObjectRequest(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, now time.Time) (*http.Request, error) {
	endpoint := fmt.Sprintf("https://%s.s3.%s.amazonaws.com%s", config.BucketName, config.Region, s3ObjectPath(objectKey))
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}

	signS3ObjectRequest(req, credentials, config.Region, nil, now)
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

func getS3Object(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, now time.Time) ([]byte, bool, error) {
	req, err := buildS3GetObjectRequest(ctx, config, credentials, objectKey, now)
	if err != nil {
		return nil, false, err
	}

	resp, err := microCMSBackupHTTPClient.Do(req)
	if err != nil {
		return nil, false, err
	}

	if resp.StatusCode == http.StatusNotFound {
		closeMicroCMSBackupResponseBody(resp)
		return nil, false, nil
	}

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		bodySnippet := microCMSBackupResponseBodySnippet(resp)
		if bodySnippet != "" {
			return nil, false, fmt.Errorf("S3 returned status %d: %s", resp.StatusCode, bodySnippet)
		}
		return nil, false, fmt.Errorf("S3 returned status %d", resp.StatusCode)
	}

	body, readErr := io.ReadAll(io.LimitReader(resp.Body, 64*1024))
	_ = resp.Body.Close()
	if readErr != nil {
		return nil, false, readErr
	}

	return body, true, nil
}

func uploadMicroCMSBackupToS3(ctx context.Context, config s3BackupConfig, credentials awsCredentials, objectKey string, body []byte, now time.Time) error {
	_, err := putS3Object(ctx, config, credentials, objectKey, body, microCMSBackupContentType, nil, now)
	return err
}
