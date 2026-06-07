package webhook

import (
	"bytes"
	"context"
	"encoding/csv"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
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

func TestFetchMicroCMSBackupArticlesFetchesEveryPage(t *testing.T) {
	originalClient := microCMSBackupHTTPClient
	originalBaseURL := microCMSBackupAPIBaseURL

	microCMSBackupAPIBaseURL = "https://%s.microcms.test/api/v1/blog"

	requestOffsets := []string{}
	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			requestOffsets = append(requestOffsets, r.URL.Query().Get("offset"))

			switch r.URL.Query().Get("offset") {
			case "0":
				return responseWithBody(http.StatusOK, `{
					"contents": [{"id": "article-a"}, {"id": "article-b"}],
					"totalCount": 3,
					"offset": 0,
					"limit": 20
				}`), nil
			case "2":
				return responseWithBody(http.StatusOK, `{
					"contents": [{"id": "article-c"}],
					"totalCount": 3,
					"offset": 2,
					"limit": 20
				}`), nil
			default:
				t.Fatalf("unexpected offset = %q", r.URL.Query().Get("offset"))
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

	if len(articles) != 3 {
		t.Fatalf("articles length = %d, want 3", len(articles))
	}

	if strings.Join(requestOffsets, ",") != "0,2" {
		t.Fatalf("request offsets = %v, want [0 2]", requestOffsets)
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

func TestIsMicroCMSFirstPublishWebhook(t *testing.T) {
	for _, testCase := range []struct {
		name    string
		payload microCMSWebhookPayload
		want    bool
	}{
		{
			name: "new published content",
			payload: microCMSWebhookPayload{
				API:  "blog",
				ID:   "article-a",
				Type: "new",
				Contents: &microCMSWebhookPayloadState{
					New: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
				},
			},
			want: true,
		},
		{
			name: "draft to published content",
			payload: microCMSWebhookPayload{
				API:  "blog",
				ID:   "article-a",
				Type: "edit",
				Contents: &microCMSWebhookPayloadState{
					Old: &microCMSWebhookContentState{Status: []string{"DRAFT"}},
					New: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
				},
			},
			want: true,
		},
		{
			name: "published content update",
			payload: microCMSWebhookPayload{
				API:  "blog",
				ID:   "article-a",
				Type: "edit",
				Contents: &microCMSWebhookPayloadState{
					Old: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
					New: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
				},
			},
			want: false,
		},
		{
			name: "non blog api",
			payload: microCMSWebhookPayload{
				API:  "categories",
				ID:   "category-a",
				Type: "new",
				Contents: &microCMSWebhookPayloadState{
					New: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
				},
			},
			want: false,
		},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			if got := isMicroCMSFirstPublishWebhook(testCase.payload); got != testCase.want {
				t.Fatalf("isMicroCMSFirstPublishWebhook() = %t, want %t", got, testCase.want)
			}
		})
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

func TestMicroCMSBackupHandlerSendsOneSignalOnFirstPublish(t *testing.T) {
	t.Setenv("MICROCMS_WEBHOOK_SECRET", "webhook-secret")
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")
	t.Setenv("AWS_ACCESS_KEY_ID", "AKIAEXAMPLE")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "secret")
	t.Setenv("AWS_DEFAULT_REGION", "ap-northeast-1")
	t.Setenv("BUCKET_NAME", "backup-bucket")
	t.Setenv("ONESIGNAL_APP_ID", "onesignal-app-id")
	t.Setenv("ONESIGNAL_REST_API_KEY", "onesignal-rest-api-key")
	t.Setenv("BASE_URL", "https://example.com")
	t.Setenv("BASE_TITLE", "Example Blog")

	originalClient := microCMSBackupHTTPClient
	originalBaseURL := microCMSBackupAPIBaseURL
	originalNow := microCMSBackupNow

	microCMSBackupAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	microCMSBackupNow = func() time.Time {
		return time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC)
	}

	backupPutCount := 0
	pendingMarkerPutCount := 0
	sentMarkerPutCount := 0
	oneSignalRequestCount := 0
	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "example.microcms.test":
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
							"related_articles": []
						}
					],
					"totalCount": 1,
					"offset": 0,
					"limit": 20
				}`), nil
			case "backup-bucket.s3.ap-northeast-1.amazonaws.com":
				body, err := io.ReadAll(r.Body)
				if err != nil {
					t.Fatalf("read S3 body error = %v", err)
				}

				switch r.URL.EscapedPath() {
				case "/backups/microcms/blog/2026/06/06/microcmsblogbackup-20260606T070809JST.csv":
					backupPutCount++
					if !strings.Contains(string(body), "Article A") {
						t.Fatalf("backup body = %s", string(body))
					}
				case "/onesignal/notifications/blog/article-a.json":
					if r.Header.Get("If-None-Match") == "*" {
						pendingMarkerPutCount++
						if !strings.Contains(string(body), `"status":"pending"`) {
							t.Fatalf("pending marker body = %s", string(body))
						}
					} else {
						sentMarkerPutCount++
						if !strings.Contains(string(body), `"status":"sent"`) || !strings.Contains(string(body), `"oneSignalNotificationId":"notification-a"`) {
							t.Fatalf("sent marker body = %s", string(body))
						}
					}
				default:
					t.Fatalf("unexpected S3 path = %q", r.URL.EscapedPath())
				}
				return responseWithBody(http.StatusOK, ""), nil
			case "api.onesignal.com":
				oneSignalRequestCount++
				if r.Method != http.MethodPost {
					t.Fatalf("OneSignal method = %s, want POST", r.Method)
				}
				if got := r.Header.Get("Authorization"); got != "Key onesignal-rest-api-key" {
					t.Fatalf("OneSignal Authorization = %q", got)
				}

				var body map[string]interface{}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
					t.Fatalf("OneSignal request json error = %v", err)
				}
				if body["app_id"] != "onesignal-app-id" {
					t.Fatalf("OneSignal app_id = %#v", body["app_id"])
				}
				if body["url"] != "https://example.com/articles/article-a" {
					t.Fatalf("OneSignal url = %#v", body["url"])
				}
				if body["send_after"] != "2026-06-05T22:13:09Z" {
					t.Fatalf("OneSignal send_after = %#v", body["send_after"])
				}
				if body["idempotency_key"] != oneSignalIdempotencyKey("blog", "article-a") {
					t.Fatalf("OneSignal idempotency_key = %#v", body["idempotency_key"])
				}
				if body["ttl"] != float64(86400) {
					t.Fatalf("OneSignal ttl = %#v", body["ttl"])
				}
				data, ok := body["data"].(map[string]interface{})
				if !ok || data["source"] != "blog" || data["articleId"] != "article-a" {
					t.Fatalf("OneSignal data = %#v", body["data"])
				}
				headings, ok := body["headings"].(map[string]interface{})
				if !ok || headings["ja"] != "新しい記事" {
					t.Fatalf("OneSignal headings = %#v", body["headings"])
				}
				contents, ok := body["contents"].(map[string]interface{})
				if !ok || contents["ja"] != "「Article A」を公開しました" {
					t.Fatalf("OneSignal contents = %#v", body["contents"])
				}
				return responseWithBody(http.StatusOK, `{"id":"notification-a"}`), nil
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

	webhookBody := []byte(`{
		"service": "example",
		"api": "blog",
		"id": "article-a",
		"type": "edit",
		"contents": {
			"old": {"status": ["DRAFT"], "publishValue": null, "draftValue": {"title": "Article A"}},
			"new": {"status": ["PUBLISH"], "publishValue": {"title": "Article A"}, "draftValue": null}
		}
	}`)
	req := httptest.NewRequest(http.MethodPost, "/api/webhook/microcmsbackup", bytes.NewReader(webhookBody))
	req.Header.Set("x-microcms-signature", expectedMicroCMSWebhookSignature(webhookBody, "webhook-secret"))
	rec := httptest.NewRecorder()

	MicroCMSBackupHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", rec.Code, http.StatusOK, rec.Body.String())
	}
	for name, got := range map[string]int{
		"backupPutCount":        backupPutCount,
		"pendingMarkerPutCount": pendingMarkerPutCount,
		"sentMarkerPutCount":    sentMarkerPutCount,
		"oneSignalRequestCount": oneSignalRequestCount,
	} {
		if got != 1 {
			t.Fatalf("%s = %d, want 1", name, got)
		}
	}

	gotBody := compactJSON(rec.Body.String())
	for _, want := range []string{
		`"oneSignalNotificationSent":true`,
		`"oneSignalMarkerKey":"onesignal/notifications/blog/article-a.json"`,
		`"oneSignalNotificationId":"notification-a"`,
	} {
		if !strings.Contains(gotBody, want) {
			t.Fatalf("body = %s, want it to contain %s", gotBody, want)
		}
	}
}

func TestOneSignalIdempotencyKey(t *testing.T) {
	got := oneSignalIdempotencyKey("blog", "article-a")
	if len(got) != 36 || got[14] != '5' || strings.Count(got, "-") != 4 {
		t.Fatalf("idempotency key = %q, want UUID v5 format", got)
	}
	if got != oneSignalIdempotencyKey("blog", "article-a") {
		t.Fatal("idempotency key should be stable for the same payload")
	}
	if got == oneSignalIdempotencyKey("blog", "article-b") {
		t.Fatal("idempotency key should differ by article ID")
	}
	if got == oneSignalIdempotencyKey("zenn", "article-a") {
		t.Fatal("idempotency key should differ by source")
	}
}

func TestNotifyExternalArticlesFirstPublishWithOneSignalSendsZennNotification(t *testing.T) {
	t.Setenv("ONESIGNAL_APP_ID", "onesignal-app-id")
	t.Setenv("ONESIGNAL_REST_API_KEY", "onesignal-rest-api-key")
	t.Setenv("BASE_URL", "https://example.com")
	t.Setenv("BASE_TITLE", "Example Blog")
	t.Setenv("AWS_ACCESS_KEY_ID", "AKIAEXAMPLE")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "secret")
	t.Setenv("AWS_DEFAULT_REGION", "ap-northeast-1")
	t.Setenv("BUCKET_NAME", "backup-bucket")

	originalClient := microCMSBackupHTTPClient
	pendingMarkerPutCount := 0
	sentMarkerPutCount := 0
	oneSignalRequestCount := 0

	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "backup-bucket.s3.ap-northeast-1.amazonaws.com":
				body, err := io.ReadAll(r.Body)
				if err != nil {
					t.Fatalf("read S3 body error = %v", err)
				}
				if r.URL.EscapedPath() != "/onesignal/notifications/zenn/zenn-a.json" {
					t.Fatalf("S3 path = %q", r.URL.EscapedPath())
				}
				if r.Header.Get("If-None-Match") == "*" {
					pendingMarkerPutCount++
					if !strings.Contains(string(body), `"status":"pending"`) || !strings.Contains(string(body), `"source":"zenn"`) {
						t.Fatalf("pending marker body = %s", string(body))
					}
				} else {
					sentMarkerPutCount++
					if !strings.Contains(string(body), `"status":"sent"`) || !strings.Contains(string(body), `"oneSignalNotificationId":"notification-a"`) {
						t.Fatalf("sent marker body = %s", string(body))
					}
				}
				return responseWithBody(http.StatusOK, ""), nil
			case "api.onesignal.com":
				oneSignalRequestCount++

				var body map[string]interface{}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
					t.Fatalf("OneSignal request json error = %v", err)
				}
				if body["url"] != "https://zenn.dev/realunivlog/articles/zenn-a" {
					t.Fatalf("OneSignal url = %#v", body["url"])
				}
				if body["idempotency_key"] != oneSignalIdempotencyKey("zenn", "zenn-a") {
					t.Fatalf("OneSignal idempotency_key = %#v", body["idempotency_key"])
				}
				if body["ttl"] != float64(86400) {
					t.Fatalf("OneSignal ttl = %#v", body["ttl"])
				}
				data, ok := body["data"].(map[string]interface{})
				if !ok || data["source"] != "zenn" || data["articleId"] != "zenn-a" {
					t.Fatalf("OneSignal data = %#v", body["data"])
				}
				return responseWithBody(http.StatusOK, `{"id":"notification-a"}`), nil
			default:
				t.Fatalf("unexpected host = %q", r.URL.Host)
				return nil, nil
			}
		}),
	}

	t.Cleanup(func() {
		microCMSBackupHTTPClient = originalClient
	})

	results, err := NotifyExternalArticlesFirstPublishWithOneSignal(
		t.Context(),
		[]ExternalArticleNotification{{
			Source:    "zenn",
			ContentID: "zenn-a",
			Title:     "Zenn A",
			URL:       "https://zenn.dev/realunivlog/articles/zenn-a",
		}},
		time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC),
	)
	if err != nil {
		t.Fatalf("NotifyExternalArticlesFirstPublishWithOneSignal() error = %v", err)
	}
	if !reflect.DeepEqual(results, []OneSignalNotificationResult{{
		Sent:           true,
		MarkerCreated:  true,
		MarkerKey:      "onesignal/notifications/zenn/zenn-a.json",
		NotificationID: "notification-a",
	}}) {
		t.Fatalf("results = %#v", results)
	}
	for name, got := range map[string]int{
		"pendingMarkerPutCount": pendingMarkerPutCount,
		"sentMarkerPutCount":    sentMarkerPutCount,
		"oneSignalRequestCount": oneSignalRequestCount,
	} {
		if got != 1 {
			t.Fatalf("%s = %d, want 1", name, got)
		}
	}
}

func TestNotifyMicroCMSFirstPublishSkipsWhenMarkerAlreadyExists(t *testing.T) {
	t.Setenv("ONESIGNAL_APP_ID", "onesignal-app-id")
	t.Setenv("ONESIGNAL_REST_API_KEY", "onesignal-rest-api-key")
	t.Setenv("BASE_URL", "https://example.com")
	t.Setenv("BASE_TITLE", "Example Blog")

	originalClient := microCMSBackupHTTPClient
	originalNow := microCMSBackupNow

	microCMSBackupNow = func() time.Time {
		return time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC)
	}

	oneSignalRequestCount := 0
	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "backup-bucket.s3.ap-northeast-1.amazonaws.com":
				if r.Header.Get("If-None-Match") != "*" {
					t.Fatalf("If-None-Match = %q, want *", r.Header.Get("If-None-Match"))
				}
				return responseWithBody(http.StatusPreconditionFailed, ""), nil
			case "api.onesignal.com":
				oneSignalRequestCount++
				return responseWithBody(http.StatusOK, `{"id":"notification-a"}`), nil
			default:
				t.Fatalf("unexpected host = %q", r.URL.Host)
				return nil, nil
			}
		}),
	}

	t.Cleanup(func() {
		microCMSBackupHTTPClient = originalClient
		microCMSBackupNow = originalNow
	})

	payload := microCMSWebhookPayload{
		API:  "blog",
		ID:   "article-a",
		Type: "new",
		Contents: &microCMSWebhookPayloadState{
			New: &microCMSWebhookContentState{
				Status:       []string{"PUBLISH"},
				PublishValue: map[string]interface{}{"title": "Article A"},
			},
		},
	}
	result, err := notifyMicroCMSFirstPublishWithOneSignal(
		t.Context(),
		s3BackupConfig{BucketName: "backup-bucket", Region: "ap-northeast-1"},
		awsCredentials{AccessKeyID: "AKIAEXAMPLE", SecretAccessKey: "secret"},
		payload,
		microCMSBackupNow(),
	)
	if err != nil {
		t.Fatalf("notifyMicroCMSFirstPublishWithOneSignal() error = %v", err)
	}
	if result.Sent {
		t.Fatal("result.Sent = true, want false")
	}
	if result.MarkerKey != "onesignal/notifications/blog/article-a.json" {
		t.Fatalf("MarkerKey = %q", result.MarkerKey)
	}
	if oneSignalRequestCount != 0 {
		t.Fatalf("oneSignalRequestCount = %d, want 0", oneSignalRequestCount)
	}
}
