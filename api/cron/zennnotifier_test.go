package cron

import (
	"context"
	"errors"
	"net/http"
	"reflect"
	"testing"
	"time"

	webhookapi "NextBlogApp/api/webhook"
)

func setZennNotificationEnv(t *testing.T) {
	t.Helper()

	t.Setenv("ONESIGNAL_APP_ID", "onesignal-app-id")
	t.Setenv("ONESIGNAL_REST_API_KEY", "onesignal-rest-api-key")
	t.Setenv("BASE_URL", "https://example.com")
	t.Setenv("BASE_TITLE", "Example Blog")
	t.Setenv("AWS_ACCESS_KEY_ID", "AKIAEXAMPLE")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "secret")
	t.Setenv("AWS_DEFAULT_REGION", "ap-northeast-1")
	t.Setenv("BUCKET_NAME", "backup-bucket")
}

func disableZennNotificationEnv(t *testing.T) {
	t.Helper()

	envNames := append([]string{}, zennNotificationRequiredEnvVariable...)
	envNames = append(envNames, "AWS_REGION", "AWS_DEFAULT_REGION", cloudflarePagesDeployHookEnv)
	for _, envName := range envNames {
		t.Setenv(envName, "")
	}
}

func TestZennArticleID(t *testing.T) {
	if got := zennArticleID("https://zenn.dev/realunivlog/articles/zenn-article-a"); got != "zenn-article-a" {
		t.Fatalf("zennArticleID() = %q", got)
	}

	if got := zennArticleID("https://example.com/post"); len(got) != 32 {
		t.Fatalf("fallback zennArticleID() = %q, want 32 hex chars", got)
	}
}

func TestRunZennFirstPublishNotifications(t *testing.T) {
	setZennNotificationEnv(t)

	originalClient := zennNotificationHTTPClient
	originalNotify := zennNotifyArticlesWithOneSignal
	zennNotificationHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			if r.URL.String() != zennNotificationFeedURL {
				t.Fatalf("Zenn RSS URL = %q", r.URL.String())
			}
			return responseWithBody(http.StatusOK, `
				<rss>
					<channel>
						<item>
							<title>Second Zenn</title>
							<link>https://zenn.dev/realunivlog/articles/second-zenn</link>
							<pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate>
						</item>
						<item>
							<title>First Zenn</title>
							<link>https://zenn.dev/realunivlog/articles/first-zenn</link>
							<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
						</item>
					</channel>
				</rss>
			`), nil
		}),
	}

	var capturedArticles []webhookapi.ExternalArticleNotification
	zennNotifyArticlesWithOneSignal = func(ctx context.Context, articles []webhookapi.ExternalArticleNotification, now time.Time) ([]webhookapi.OneSignalNotificationResult, error) {
		capturedArticles = append([]webhookapi.ExternalArticleNotification{}, articles...)
		return []webhookapi.OneSignalNotificationResult{
			{MarkerKey: "onesignal/notifications/zenn/first-zenn.json"},
			{Sent: true, MarkerCreated: true, MarkerKey: "onesignal/notifications/zenn/second-zenn.json", NotificationID: "notification-a"},
		}, nil
	}

	t.Cleanup(func() {
		zennNotificationHTTPClient = originalClient
		zennNotifyArticlesWithOneSignal = originalNotify
	})

	summary, err := runZennFirstPublishNotifications(t.Context(), time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC))
	if err != nil {
		t.Fatalf("runZennFirstPublishNotifications() error = %v", err)
	}

	wantArticles := []webhookapi.ExternalArticleNotification{
		{Source: "zenn", ContentID: "first-zenn", Title: "First Zenn", URL: "https://zenn.dev/realunivlog/articles/first-zenn"},
		{Source: "zenn", ContentID: "second-zenn", Title: "Second Zenn", URL: "https://zenn.dev/realunivlog/articles/second-zenn"},
	}
	if !reflect.DeepEqual(capturedArticles, wantArticles) {
		t.Fatalf("articles = %#v, want %#v", capturedArticles, wantArticles)
	}

	if !summary.Enabled || summary.CheckedCount != 2 || summary.NewCount != 1 || summary.SentCount != 1 {
		t.Fatalf("summary = %#v", summary)
	}
	if !reflect.DeepEqual(summary.MarkerKeys, []string{
		"onesignal/notifications/zenn/first-zenn.json",
		"onesignal/notifications/zenn/second-zenn.json",
	}) {
		t.Fatalf("marker keys = %#v", summary.MarkerKeys)
	}
}

func TestRunZennFirstPublishNotificationsTriggersCloudflarePagesDeploy(t *testing.T) {
	setZennNotificationEnv(t)
	t.Setenv(cloudflarePagesDeployHookEnv, "https://deploy.example/hook")

	originalZennClient := zennNotificationHTTPClient
	originalNotify := zennNotifyArticlesWithOneSignal
	originalDeployClient := cloudflarePagesDeployHTTPClient
	zennNotificationHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			return responseWithBody(http.StatusOK, `
				<rss>
					<channel>
						<item>
							<title>Zenn A</title>
							<link>https://zenn.dev/realunivlog/articles/zenn-a</link>
							<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
						</item>
					</channel>
				</rss>
			`), nil
		}),
	}
	zennNotifyArticlesWithOneSignal = func(ctx context.Context, articles []webhookapi.ExternalArticleNotification, now time.Time) ([]webhookapi.OneSignalNotificationResult, error) {
		return []webhookapi.OneSignalNotificationResult{
			{Sent: true, MarkerCreated: true, MarkerKey: "onesignal/notifications/zenn/zenn-a.json", NotificationID: "notification-a"},
		}, nil
	}

	deployRequestCount := 0
	cloudflarePagesDeployHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			deployRequestCount++
			if r.Method != http.MethodPost {
				t.Fatalf("deploy method = %q, want POST", r.Method)
			}
			if r.URL.String() != "https://deploy.example/hook" {
				t.Fatalf("deploy URL = %q", r.URL.String())
			}
			return responseWithBody(http.StatusOK, `{"success":true}`), nil
		}),
	}

	t.Cleanup(func() {
		zennNotificationHTTPClient = originalZennClient
		zennNotifyArticlesWithOneSignal = originalNotify
		cloudflarePagesDeployHTTPClient = originalDeployClient
	})

	summary, err := runZennFirstPublishNotifications(t.Context(), time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC))
	if err != nil {
		t.Fatalf("runZennFirstPublishNotifications() error = %v", err)
	}
	if deployRequestCount != 1 {
		t.Fatalf("deployRequestCount = %d, want 1", deployRequestCount)
	}
	if summary.CloudflarePagesDeploy == nil || !summary.CloudflarePagesDeploy.Enabled || !summary.CloudflarePagesDeploy.Triggered {
		t.Fatalf("CloudflarePagesDeploy = %#v", summary.CloudflarePagesDeploy)
	}
}

func TestRunZennFirstPublishNotificationsTriggersDeployWhenOneSignalFailsAfterMarker(t *testing.T) {
	setZennNotificationEnv(t)
	t.Setenv(cloudflarePagesDeployHookEnv, "https://deploy.example/hook")

	originalZennClient := zennNotificationHTTPClient
	originalNotify := zennNotifyArticlesWithOneSignal
	originalDeployClient := cloudflarePagesDeployHTTPClient
	zennNotificationHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			return responseWithBody(http.StatusOK, `
				<rss>
					<channel>
						<item>
							<title>Zenn A</title>
							<link>https://zenn.dev/realunivlog/articles/zenn-a</link>
							<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
						</item>
					</channel>
				</rss>
			`), nil
		}),
	}
	zennNotifyArticlesWithOneSignal = func(ctx context.Context, articles []webhookapi.ExternalArticleNotification, now time.Time) ([]webhookapi.OneSignalNotificationResult, error) {
		return []webhookapi.OneSignalNotificationResult{
			{MarkerCreated: true, MarkerKey: "onesignal/notifications/zenn/zenn-a.json"},
		}, errors.New("onesignal failed")
	}

	deployRequestCount := 0
	cloudflarePagesDeployHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			deployRequestCount++
			return responseWithBody(http.StatusOK, `{"success":true}`), nil
		}),
	}

	t.Cleanup(func() {
		zennNotificationHTTPClient = originalZennClient
		zennNotifyArticlesWithOneSignal = originalNotify
		cloudflarePagesDeployHTTPClient = originalDeployClient
	})

	summary, err := runZennFirstPublishNotifications(t.Context(), time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC))
	if err == nil {
		t.Fatal("runZennFirstPublishNotifications() error = nil, want error")
	}
	if deployRequestCount != 1 {
		t.Fatalf("deployRequestCount = %d, want 1", deployRequestCount)
	}
	if summary == nil || summary.NewCount != 1 || summary.SentCount != 0 {
		t.Fatalf("summary = %#v", summary)
	}
	if summary.CloudflarePagesDeploy == nil || !summary.CloudflarePagesDeploy.Triggered {
		t.Fatalf("CloudflarePagesDeploy = %#v", summary.CloudflarePagesDeploy)
	}
}

func TestRunZennFirstPublishNotificationsSkipsWhenNotConfigured(t *testing.T) {
	disableZennNotificationEnv(t)

	summary, err := runZennFirstPublishNotifications(t.Context(), time.Date(2026, 6, 5, 22, 8, 9, 0, time.UTC))
	if err != nil {
		t.Fatalf("runZennFirstPublishNotifications() error = %v", err)
	}
	if summary.Enabled {
		t.Fatalf("summary.Enabled = true, want false")
	}
}
