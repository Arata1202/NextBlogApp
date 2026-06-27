package contentops

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

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
				assertOneSignalPushTargeting(t, body)
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
