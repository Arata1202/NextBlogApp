package webhook

import (
	"bytes"
	"context"
	"encoding/csv"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) {
	return fn(r)
}

func responseWithBody(statusCode int, body string) *http.Response {
	return &http.Response{
		StatusCode: statusCode,
		Header:     http.Header{"Content-Type": []string{"application/json"}},
		Body:       io.NopCloser(strings.NewReader(body)),
	}
}

func compactJSON(input string) string {
	var buffer bytes.Buffer
	if err := json.Compact(&buffer, []byte(input)); err != nil {
		return input
	}

	return buffer.String()
}

func TestBuildMicroCMSBackupRequest(t *testing.T) {
	req, err := buildMicroCMSBackupRequest(t.Context(), "example", "api-key", 10, 20)
	if err != nil {
		t.Fatalf("buildMicroCMSBackupRequest() error = %v", err)
	}

	if req.Method != http.MethodGet {
		t.Fatalf("method = %s, want GET", req.Method)
	}

	if req.URL.String() != "https://example.microcms.io/api/v1/blog?fields=id%2Ctitle%2Cdescription%2Ccategories%2Ctags%2Cthumbnail%2Cintroduction_blocks%2Ccontent_blocks%2Crelated_articles%2CpublishedAt%2CupdatedAt&limit=10&offset=20" {
		t.Fatalf("url = %q", req.URL.String())
	}

	if got := req.Header.Get("X-MICROCMS-API-KEY"); got != "api-key" {
		t.Fatalf("X-MICROCMS-API-KEY = %q, want %q", got, "api-key")
	}
}

func TestBuildMicroCMSBackupRequestNormalizesServiceDomain(t *testing.T) {
	for _, serviceDomain := range []string{
		"example.microcms.io",
		"https://example.microcms.io/api/v1",
	} {
		t.Run(serviceDomain, func(t *testing.T) {
			req, err := buildMicroCMSBackupRequest(t.Context(), serviceDomain, "api-key", 10, 20)
			if err != nil {
				t.Fatalf("buildMicroCMSBackupRequest() error = %v", err)
			}

			if req.URL.String() != "https://example.microcms.io/api/v1/blog?fields=id%2Ctitle%2Cdescription%2Ccategories%2Ctags%2Cthumbnail%2Cintroduction_blocks%2Ccontent_blocks%2Crelated_articles%2CpublishedAt%2CupdatedAt&limit=10&offset=20" {
				t.Fatalf("url = %q", req.URL.String())
			}
		})
	}
}

func TestFetchMicroCMSBackupArticlesReducesLimitWhenResponseIsTooLarge(t *testing.T) {
	originalClient := microCMSBackupHTTPClient
	originalBaseURL := microCMSBackupAPIBaseURL

	microCMSBackupAPIBaseURL = "https://%s.microcms.test/api/v1/blog"

	requestLimits := []string{}
	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			requestLimits = append(requestLimits, r.URL.Query().Get("limit"))

			switch r.URL.Query().Get("limit") {
			case "20":
				return responseWithBody(http.StatusBadRequest, `{"message":"Response body size is too long. Check your url parameters."}`), nil
			case "10":
				if got := r.URL.Query().Get("offset"); got != "0" {
					t.Fatalf("offset = %q, want 0", got)
				}
				return responseWithBody(http.StatusOK, `{
					"contents": [{"id": "article-a"}],
					"totalCount": 1,
					"offset": 0,
					"limit": 10
				}`), nil
			default:
				t.Fatalf("unexpected limit = %q", r.URL.Query().Get("limit"))
				return nil, nil
			}
		}),
	}

	t.Cleanup(func() {
		microCMSBackupHTTPClient = originalClient
		microCMSBackupAPIBaseURL = originalBaseURL
	})

	articles, err := fetchMicroCMSBackupArticles(t.Context(), "example", "api-key")
	if err != nil {
		t.Fatalf("fetchMicroCMSBackupArticles() error = %v", err)
	}

	if len(articles) != 1 || articles[0]["id"] != "article-a" {
		t.Fatalf("articles = %#v", articles)
	}

	if strings.Join(requestLimits, ",") != "20,10" {
		t.Fatalf("request limits = %v, want [20 10]", requestLimits)
	}
}

func TestWriteMicroCMSBackupCSV(t *testing.T) {
	articles := []map[string]interface{}{
		{
			"id":          "article-a",
			"title":       "Title A",
			"description": "Line 1\nLine 2",
			"categories": []interface{}{
				map[string]interface{}{"id": "category-a", "name": "Category A"},
				map[string]interface{}{"id": "category-b", "name": "Category B"},
			},
			"tags": []interface{}{
				map[string]interface{}{"id": "tag-a", "name": "Tag A"},
				"tag-b",
			},
			"thumbnail": map[string]interface{}{"url": "https://images.example/thumbnail.png", "width": float64(1200)},
			"introduction_blocks": []interface{}{
				map[string]interface{}{"fieldId": "rich_text", "rich_text": "<p>Intro</p>"},
			},
			"content_blocks": []interface{}{
				map[string]interface{}{"fieldId": "rich_text", "rich_text": "<p>Body</p>"},
			},
			"related_articles": []interface{}{
				map[string]interface{}{"fieldId": "article", "article": map[string]interface{}{"id": "article-b"}},
			},
		},
	}

	var buffer bytes.Buffer
	if err := writeMicroCMSBackupCSV(&buffer, articles); err != nil {
		t.Fatalf("writeMicroCMSBackupCSV() error = %v", err)
	}

	records, err := csv.NewReader(strings.NewReader(buffer.String())).ReadAll()
	if err != nil {
		t.Fatalf("csv read error = %v", err)
	}
	if len(records) != 2 {
		t.Fatalf("records length = %d, want 2", len(records))
	}

	header := records[0]
	if header[0] != "コンテンツID\n※空欄で構いません。特定の値を設定したい場合に入力してください。" {
		t.Fatalf("content id header = %q", header[0])
	}
	if strings.Join(header[1:], ",") != "title,description,categories,tags,thumbnail,introduction_blocks,content_blocks,related_articles" {
		t.Fatalf("header = %v", header)
	}

	row := records[1]
	for columnIndex, want := range []string{
		"article-a",
		"Title A",
		"Line 1\nLine 2",
		"category-a,category-b",
		"tag-a,tag-b",
		"https://images.example/thumbnail.png",
	} {
		if row[columnIndex] != want {
			t.Fatalf("row[%d] = %q, want %q", columnIndex, row[columnIndex], want)
		}
	}

	var introductionBlocks []map[string]interface{}
	if err := json.Unmarshal([]byte(row[6]), &introductionBlocks); err != nil {
		t.Fatalf("introduction_blocks json error = %v", err)
	}
	if introductionBlocks[0]["fieldId"] != "rich_text" {
		t.Fatalf("introduction_blocks = %#v", introductionBlocks)
	}

	var relatedArticles []map[string]interface{}
	if err := json.Unmarshal([]byte(row[8]), &relatedArticles); err != nil {
		t.Fatalf("related_articles json error = %v", err)
	}
	if relatedArticles[0]["fieldId"] != "article" {
		t.Fatalf("related_articles = %#v", relatedArticles)
	}
}

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

func TestMicroCMSBackupHandlerUnauthorized(t *testing.T) {
	t.Setenv("MICROCMS_WEBHOOK_SECRET", "secret")

	req := httptest.NewRequest(http.MethodPost, "/api/webhook/microcmsbackup", strings.NewReader(`{"api":"blog","id":"article-a","type":"edit"}`))
	req.Header.Set("x-microcms-signature", "invalid")
	rec := httptest.NewRecorder()

	MicroCMSBackupHandler(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusUnauthorized)
	}
}

func TestMicroCMSBackupHandlerSuccess(t *testing.T) {
	t.Setenv("MICROCMS_WEBHOOK_SECRET", "webhook-secret")
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")
	t.Setenv("AWS_ACCESS_KEY_ID", "AKIAEXAMPLE")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "secret")
	t.Setenv("AWS_REGION", "")
	t.Setenv("AWS_DEFAULT_REGION", "ap-northeast-1")
	t.Setenv("BUCKET_NAME", "backup-bucket")

	originalClient := microCMSBackupHTTPClient
	originalBaseURL := microCMSBackupAPIBaseURL
	originalNow := microCMSBackupNow

	microCMSBackupAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	microCMSBackupNow = func() time.Time {
		return time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC)
	}

	var capturedS3Body string
	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "example.microcms.test":
				if got := r.Header.Get("X-MICROCMS-API-KEY"); got != "api-key" {
					t.Fatalf("X-MICROCMS-API-KEY = %q, want api-key", got)
				}
				return responseWithBody(http.StatusOK, `{
					"contents": [
						{
							"id": "article-a",
							"title": "Article A",
							"description": "Description A",
							"categories": [{"id": "category-a"}],
							"tags": [{"id": "tag-a"}],
							"thumbnail": {"url": "https://images.example/thumbnail.png"},
							"introduction_blocks": [{"fieldId": "rich_text", "rich_text": "<p>Intro</p>"}],
							"content_blocks": [{"fieldId": "rich_text", "rich_text": "<p>Body</p>"}],
							"related_articles": [{"fieldId": "article", "article": {"id": "article-b"}}]
						}
					],
					"totalCount": 1,
					"offset": 0,
					"limit": 100
				}`), nil
			case "backup-bucket.s3.ap-northeast-1.amazonaws.com":
				if r.Method != http.MethodPut {
					t.Fatalf("S3 method = %s, want PUT", r.Method)
				}
				if r.URL.EscapedPath() != "/backups/microcms/blog/2026/06/06/microcmsblogbackup-20260606T070809JST.csv" {
					t.Fatalf("S3 path = %q", r.URL.EscapedPath())
				}
				if r.Header.Get("Authorization") == "" {
					t.Fatal("Authorization header is empty")
				}
				body, err := io.ReadAll(r.Body)
				if err != nil {
					t.Fatalf("read S3 body error = %v", err)
				}
				capturedS3Body = string(body)
				return responseWithBody(http.StatusOK, ""), nil
			default:
				t.Fatalf("unexpected host = %q", r.URL.Host)
				return nil, nil
			}
		}),
	}

	t.Cleanup(func() {
		microCMSBackupHTTPClient = originalClient
		microCMSBackupAPIBaseURL = originalBaseURL
		microCMSBackupNow = originalNow
	})

	webhookBody := []byte(`{"api":"blog","id":"article-a","type":"edit"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/webhook/microcmsbackup", bytes.NewReader(webhookBody))
	req.Header.Set("x-microcms-signature", expectedMicroCMSWebhookSignature(webhookBody, "webhook-secret"))
	rec := httptest.NewRecorder()

	MicroCMSBackupHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", rec.Code, http.StatusOK, rec.Body.String())
	}

	gotBody := compactJSON(rec.Body.String())
	for _, want := range []string{
		`"success":true`,
		`"articleCount":1`,
		`"bucketName":"backup-bucket"`,
		`"objectKey":"backups/microcms/blog/2026/06/06/microcmsblogbackup-20260606T070809JST.csv"`,
	} {
		if !strings.Contains(gotBody, want) {
			t.Fatalf("body = %s, want it to contain %s", gotBody, want)
		}
	}

	for _, want := range []string{
		"Article A",
		"category-a",
		"tag-a",
		"https://images.example/thumbnail.png",
		"related_articles",
	} {
		if !strings.Contains(capturedS3Body, want) {
			t.Fatalf("S3 body does not contain %q: %s", want, capturedS3Body)
		}
	}
}
