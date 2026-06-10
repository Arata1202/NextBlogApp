package contentops

import (
	"context"
	"net/http"
	"strings"
	"testing"
	"time"
)

func TestMicroCMSBackupObjectKeyUsesJST(t *testing.T) {
	now := time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC)
	got := microCMSBackupObjectKey(now)
	want := "backups/microcms/blog/2026/06/06/microcmsblogbackup-20260606T070809JST.csv"
	if got != want {
		t.Fatalf("object key = %q, want %q", got, want)
	}
}

func TestBuildS3PutObjectRequestSignsRequest(t *testing.T) {
	now := time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC)
	body := []byte("csv")
	req, err := buildS3PutObjectRequest(
		context.Background(),
		s3BackupConfig{BucketName: "backup-bucket", Region: "ap-northeast-1"},
		awsCredentials{AccessKeyID: "AKIAEXAMPLE", SecretAccessKey: "secret"},
		"backups/microcms/blog/test file.csv",
		body,
		now,
	)
	if err != nil {
		t.Fatalf("buildS3PutObjectRequest() error = %v", err)
	}

	if req.Method != http.MethodPut {
		t.Fatalf("method = %s, want PUT", req.Method)
	}
	if req.URL.String() != "https://backup-bucket.s3.ap-northeast-1.amazonaws.com/backups/microcms/blog/test%20file.csv" {
		t.Fatalf("url = %q", req.URL.String())
	}
	if got := req.Header.Get("Content-Type"); got != microCMSBackupContentType {
		t.Fatalf("Content-Type = %q, want %q", got, microCMSBackupContentType)
	}
	if got := req.Header.Get("X-Amz-Date"); got != "20260605T220809Z" {
		t.Fatalf("X-Amz-Date = %q, want 20260605T220809Z", got)
	}
	if got := req.Header.Get("X-Amz-Content-Sha256"); got != sha256Hex(body) {
		t.Fatalf("X-Amz-Content-Sha256 = %q, want %q", got, sha256Hex(body))
	}

	authorization := req.Header.Get("Authorization")
	for _, want := range []string{
		"AWS4-HMAC-SHA256 Credential=AKIAEXAMPLE/20260605/ap-northeast-1/s3/aws4_request",
		"SignedHeaders=content-type;host;x-amz-content-sha256;x-amz-date",
		"Signature=",
	} {
		if !strings.Contains(authorization, want) {
			t.Fatalf("Authorization = %q, want it to contain %q", authorization, want)
		}
	}
}

func TestBuildS3PutObjectRequestSignsConditionalHeaders(t *testing.T) {
	now := time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC)
	body := []byte(`{"status":"pending"}`)
	headers := http.Header{}
	headers.Set("If-None-Match", "*")

	req, err := buildS3PutObjectRequestWithHeaders(
		context.Background(),
		s3BackupConfig{BucketName: "backup-bucket", Region: "ap-northeast-1"},
		awsCredentials{AccessKeyID: "AKIAEXAMPLE", SecretAccessKey: "secret"},
		"onesignal/notifications/blog/article-a.json",
		body,
		s3JSONContentType,
		headers,
		now,
	)
	if err != nil {
		t.Fatalf("buildS3PutObjectRequestWithHeaders() error = %v", err)
	}

	if got := req.Header.Get("If-None-Match"); got != "*" {
		t.Fatalf("If-None-Match = %q, want *", got)
	}
	if got := req.Header.Get("Content-Type"); got != s3JSONContentType {
		t.Fatalf("Content-Type = %q, want %q", got, s3JSONContentType)
	}

	authorization := req.Header.Get("Authorization")
	for _, want := range []string{
		"SignedHeaders=content-type;host;if-none-match;x-amz-content-sha256;x-amz-date",
		"Signature=",
	} {
		if !strings.Contains(authorization, want) {
			t.Fatalf("Authorization = %q, want it to contain %q", authorization, want)
		}
	}
}
