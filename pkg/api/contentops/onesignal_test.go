package contentops

import (
	"encoding/json"
	"io"
	"net/http"
	"reflect"
	"strings"
	"testing"
	"time"
)

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
