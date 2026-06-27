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
	if got != oneSignalIdempotencyKeyForAttempt("blog", "article-a", 1) {
		t.Fatal("first attempt should keep the original idempotency key")
	}
	if got == oneSignalIdempotencyKeyForAttempt("blog", "article-a", 2) {
		t.Fatal("idempotency key should differ after a no-id retry attempt advances")
	}
}

func assertOneSignalPushTargeting(t *testing.T, body map[string]interface{}) {
	t.Helper()

	if body["isIos"] != true || body["isAnyWeb"] != true {
		t.Fatalf("OneSignal platform flags = isIos:%#v isAnyWeb:%#v", body["isIos"], body["isAnyWeb"])
	}
	if _, ok := body["included_segments"]; ok {
		t.Fatalf("OneSignal included_segments should not be set: %#v", body["included_segments"])
	}

	filters, ok := body["filters"].([]interface{})
	if !ok || len(filters) != 1 {
		t.Fatalf("OneSignal filters = %#v", body["filters"])
	}

	filter, ok := filters[0].(map[string]interface{})
	if !ok || filter["field"] != "session_count" || filter["relation"] != ">" || filter["value"] != "0" {
		t.Fatalf("OneSignal filter = %#v", filters[0])
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
				if body["web_url"] != "https://example.com" {
					t.Fatalf("OneSignal web_url = %#v", body["web_url"])
				}
				if _, ok := body["url"]; ok {
					t.Fatalf("OneSignal url should not be set for native iOS: %#v", body["url"])
				}
				if _, ok := body["app_url"]; ok {
					t.Fatalf("OneSignal app_url should not be set when native iOS should only open the app: %#v", body["app_url"])
				}
				assertOneSignalPushTargeting(t, body)
				if body["idempotency_key"] != oneSignalIdempotencyKey("zenn", "zenn-a") {
					t.Fatalf("OneSignal idempotency_key = %#v", body["idempotency_key"])
				}
				if body["ttl"] != float64(86400) {
					t.Fatalf("OneSignal ttl = %#v", body["ttl"])
				}
				data, ok := body["data"].(map[string]interface{})
				if !ok ||
					data["source"] != "zenn" ||
					data["articleId"] != "zenn-a" ||
					data["articleUrl"] != "https://zenn.dev/realunivlog/articles/zenn-a" {
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

func TestNotifyExternalArticlesFirstPublishWithOneSignalFailsWhenOneSignalOmitsNotificationID(t *testing.T) {
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
	retryMarkerPutCount := 0
	oneSignalRequestCount := 0

	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "backup-bucket.s3.ap-northeast-1.amazonaws.com":
				if r.URL.EscapedPath() != "/onesignal/notifications/zenn/zenn-a.json" {
					t.Fatalf("S3 path = %q", r.URL.EscapedPath())
				}
				body, err := io.ReadAll(r.Body)
				if err != nil {
					t.Fatalf("read S3 body error = %v", err)
				}
				if r.Header.Get("If-None-Match") == "*" {
					pendingMarkerPutCount++
					if !strings.Contains(string(body), `"attempt":1`) {
						t.Fatalf("pending marker body = %s", string(body))
					}
					return responseWithBody(http.StatusOK, ""), nil
				}

				retryMarkerPutCount++
				if !strings.Contains(string(body), `"status":"pending"`) ||
					!strings.Contains(string(body), `"attempt":2`) ||
					!strings.Contains(string(body), `"lastError"`) {
					t.Fatalf("retry marker body = %s", string(body))
				}
				return responseWithBody(http.StatusOK, ""), nil
			case "api.onesignal.com":
				oneSignalRequestCount++
				return responseWithBody(http.StatusOK, `{"recipients":0}`), nil
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
	if err == nil {
		t.Fatal("NotifyExternalArticlesFirstPublishWithOneSignal() error = nil, want error")
	}
	if !strings.Contains(err.Error(), "without notification id") {
		t.Fatalf("error = %v, want missing notification id", err)
	}
	if !reflect.DeepEqual(results, []OneSignalNotificationResult{{
		MarkerCreated: true,
		MarkerKey:     "onesignal/notifications/zenn/zenn-a.json",
	}}) {
		t.Fatalf("results = %#v", results)
	}
	for name, got := range map[string]int{
		"pendingMarkerPutCount": pendingMarkerPutCount,
		"retryMarkerPutCount":   retryMarkerPutCount,
		"oneSignalRequestCount": oneSignalRequestCount,
	} {
		want := 1
		if got != want {
			t.Fatalf("%s = %d, want %d", name, got, want)
		}
	}
}

func TestNotifyExternalArticlesFirstPublishWithOneSignalRetriesPendingMarker(t *testing.T) {
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
	markerGetCount := 0
	sentMarkerPutCount := 0
	oneSignalRequestCount := 0

	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "backup-bucket.s3.ap-northeast-1.amazonaws.com":
				if r.URL.EscapedPath() != "/onesignal/notifications/zenn/zenn-a.json" {
					t.Fatalf("S3 path = %q", r.URL.EscapedPath())
				}

				switch r.Method {
				case http.MethodPut:
					body, err := io.ReadAll(r.Body)
					if err != nil {
						t.Fatalf("read S3 body error = %v", err)
					}
					if r.Header.Get("If-None-Match") == "*" {
						pendingMarkerPutCount++
						if !strings.Contains(string(body), `"status":"pending"`) {
							t.Fatalf("pending marker body = %s", string(body))
						}
						return responseWithBody(http.StatusPreconditionFailed, ""), nil
					}

					sentMarkerPutCount++
					if !strings.Contains(string(body), `"status":"sent"`) || !strings.Contains(string(body), `"oneSignalNotificationId":"notification-a"`) {
						t.Fatalf("sent marker body = %s", string(body))
					}
					return responseWithBody(http.StatusOK, ""), nil
				case http.MethodGet:
					markerGetCount++
					return responseWithBody(http.StatusOK, `{"status":"pending","source":"zenn","contentId":"zenn-a"}`), nil
				default:
					t.Fatalf("S3 method = %s", r.Method)
					return nil, nil
				}
			case "api.onesignal.com":
				oneSignalRequestCount++

				var body map[string]interface{}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
					t.Fatalf("OneSignal request json error = %v", err)
				}
				if body["idempotency_key"] != oneSignalIdempotencyKey("zenn", "zenn-a") {
					t.Fatalf("OneSignal idempotency_key = %#v", body["idempotency_key"])
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
		MarkerCreated:  false,
		MarkerKey:      "onesignal/notifications/zenn/zenn-a.json",
		NotificationID: "notification-a",
	}}) {
		t.Fatalf("results = %#v", results)
	}
	for name, got := range map[string]int{
		"pendingMarkerPutCount": pendingMarkerPutCount,
		"markerGetCount":        markerGetCount,
		"sentMarkerPutCount":    sentMarkerPutCount,
		"oneSignalRequestCount": oneSignalRequestCount,
	} {
		if got != 1 {
			t.Fatalf("%s = %d, want 1", name, got)
		}
	}
}

func TestNotifyExternalArticlesFirstPublishWithOneSignalUsesAdvancedAttemptForPendingMarker(t *testing.T) {
	t.Setenv("ONESIGNAL_APP_ID", "onesignal-app-id")
	t.Setenv("ONESIGNAL_REST_API_KEY", "onesignal-rest-api-key")
	t.Setenv("BASE_URL", "https://example.com")
	t.Setenv("BASE_TITLE", "Example Blog")
	t.Setenv("AWS_ACCESS_KEY_ID", "AKIAEXAMPLE")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "secret")
	t.Setenv("AWS_DEFAULT_REGION", "ap-northeast-1")
	t.Setenv("BUCKET_NAME", "backup-bucket")

	originalClient := microCMSBackupHTTPClient
	oneSignalRequestCount := 0

	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "backup-bucket.s3.ap-northeast-1.amazonaws.com":
				if r.URL.EscapedPath() != "/onesignal/notifications/zenn/zenn-a.json" {
					t.Fatalf("S3 path = %q", r.URL.EscapedPath())
				}

				switch r.Method {
				case http.MethodPut:
					if r.Header.Get("If-None-Match") == "*" {
						return responseWithBody(http.StatusPreconditionFailed, ""), nil
					}
					return responseWithBody(http.StatusOK, ""), nil
				case http.MethodGet:
					return responseWithBody(http.StatusOK, `{"status":"pending","source":"zenn","contentId":"zenn-a","attempt":2}`), nil
				default:
					t.Fatalf("S3 method = %s", r.Method)
					return nil, nil
				}
			case "api.onesignal.com":
				oneSignalRequestCount++

				var body map[string]interface{}
				if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
					t.Fatalf("OneSignal request json error = %v", err)
				}
				if body["idempotency_key"] != oneSignalIdempotencyKeyForAttempt("zenn", "zenn-a", 2) {
					t.Fatalf("OneSignal idempotency_key = %#v", body["idempotency_key"])
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
	if len(results) != 1 || !results[0].Sent || results[0].NotificationID != "notification-a" {
		t.Fatalf("results = %#v", results)
	}
	if oneSignalRequestCount != 1 {
		t.Fatalf("oneSignalRequestCount = %d, want 1", oneSignalRequestCount)
	}
}

func TestNotifyMicroCMSFirstPublishSkipsWhenSentMarkerAlreadyExists(t *testing.T) {
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
	pendingMarkerPutCount := 0
	markerGetCount := 0
	microCMSBackupHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "backup-bucket.s3.ap-northeast-1.amazonaws.com":
				if r.URL.EscapedPath() != "/onesignal/notifications/blog/article-a.json" {
					t.Fatalf("S3 path = %q", r.URL.EscapedPath())
				}
				switch r.Method {
				case http.MethodPut:
					if r.Header.Get("If-None-Match") != "*" {
						t.Fatalf("If-None-Match = %q, want *", r.Header.Get("If-None-Match"))
					}
					pendingMarkerPutCount++
					return responseWithBody(http.StatusPreconditionFailed, ""), nil
				case http.MethodGet:
					markerGetCount++
					return responseWithBody(http.StatusOK, `{"status":"sent","oneSignalNotificationId":"notification-a"}`), nil
				default:
					t.Fatalf("S3 method = %s", r.Method)
					return nil, nil
				}
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
	if pendingMarkerPutCount != 1 {
		t.Fatalf("pendingMarkerPutCount = %d, want 1", pendingMarkerPutCount)
	}
	if markerGetCount != 1 {
		t.Fatalf("markerGetCount = %d, want 1", markerGetCount)
	}
}
