package linkchecker

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"reflect"
	"strings"
	"testing"
	"time"

	contentops "NextBlogApp/pkg/api/contentops"

	"github.com/resend/resend-go/v4"
)

func TestLinkCheckerHandlerUnauthorized(t *testing.T) {
	t.Setenv("CRON_SECRET", "secret")

	req := httptest.NewRequest(http.MethodGet, "/api/cron/linkchecker", nil)
	rec := httptest.NewRecorder()

	LinkCheckerHandler(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusUnauthorized)
	}
}

func TestLinkCheckerHandlerSuccessWithBrokenLinksSendsNotification(t *testing.T) {
	disableZennNotificationEnv(t)
	t.Setenv("CRON_SECRET", "secret")
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")
	t.Setenv("BASE_URL", "https://site.example")
	t.Setenv("BASE_TITLE", "Real Univ Log")
	t.Setenv("LINKCHECKER_EMAIL_TO", "owner@example.com")
	t.Setenv("LINKCHECKER_EMAIL_FROM", "sender@example.com")
	t.Setenv("LINKCHECKER_RESEND_API_KEY", "resend-token")
	setLinkCheckerLookup(t, publicLinkCheckerLookup)

	originalClient := linkCheckerHTTPClient
	originalBaseURL := linkCheckerAPIBaseURL
	originalResendSend := linkCheckerResendSend

	linkCheckerAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	var capturedToken string
	var capturedParams *resend.SendEmailRequest
	var capturedOptions *resend.SendEmailOptions
	linkCheckerResendSend = func(ctx context.Context, token string, params *resend.SendEmailRequest, options *resend.SendEmailOptions) (string, error) {
		capturedToken = token
		capturedParams = params
		capturedOptions = options
		return "email-id", nil
	}

	linkCheckerHTTPClient = &http.Client{
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
							"content_blocks": [
								{"rich_text": "<p><a href=\"https://ok.example/path\">OK</a><a href=\"https://broken.example/missing\">Broken</a><a href=\"/articles/missing\">Internal</a></p>"}
							]
						}
					],
					"totalCount": 1,
					"offset": 0,
					"limit": 100
				}`), nil
			case "ok.example":
				return responseWithBody(http.StatusOK, ""), nil
			case "broken.example", "site.example":
				return responseWithBody(http.StatusNotFound, ""), nil
			default:
				t.Fatalf("unexpected host = %q", r.URL.Host)
				return nil, nil
			}
		}),
	}

	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
		linkCheckerAPIBaseURL = originalBaseURL
		linkCheckerResendSend = originalResendSend
	})

	req := httptest.NewRequest(http.MethodGet, "/api/cron/linkchecker", nil)
	req.Header.Set("Authorization", "Bearer secret")
	rec := httptest.NewRecorder()

	LinkCheckerHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", rec.Code, http.StatusOK, rec.Body.String())
	}

	gotBody := compactJSON(rec.Body.String())
	if !strings.Contains(gotBody, `"checkedCount":3`) || !strings.Contains(gotBody, `"brokenCount":2`) || !strings.Contains(gotBody, `"notified":true`) {
		t.Fatalf("body = %s", gotBody)
	}

	if capturedToken != "resend-token" {
		t.Fatalf("resend token = %q, want resend-token", capturedToken)
	}
	if capturedParams == nil {
		t.Fatal("Resend params were not captured")
	}
	if !strings.Contains(capturedParams.From, "Real Univ Log") || !strings.Contains(capturedParams.From, "sender@example.com") {
		t.Fatalf("from = %q, want site title and sender address", capturedParams.From)
	}
	if !reflect.DeepEqual(capturedParams.To, []string{"owner@example.com"}) {
		t.Fatalf("to = %v, want owner@example.com", capturedParams.To)
	}
	if capturedParams.Subject != "Real Univ Log - リンク切れを検出しました" {
		t.Fatalf("subject = %q", capturedParams.Subject)
	}
	if capturedOptions == nil || capturedOptions.IdempotencyKey == "" {
		t.Fatal("Resend idempotency key is missing")
	}

	for _, want := range []string{
		"https://broken.example/missing",
		"https://site.example/articles/missing",
		"Article A",
	} {
		if !strings.Contains(capturedParams.Html, want) || !strings.Contains(capturedParams.Text, want) {
			t.Fatalf("email bodies do not contain %q: html=%s text=%s", want, capturedParams.Html, capturedParams.Text)
		}
	}
}

func TestLinkCheckerHandlerDoesNotSendNotificationWithoutBrokenLinks(t *testing.T) {
	disableZennNotificationEnv(t)
	t.Setenv("CRON_SECRET", "secret")
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")
	setLinkCheckerLookup(t, publicLinkCheckerLookup)

	originalClient := linkCheckerHTTPClient
	originalBaseURL := linkCheckerAPIBaseURL
	originalResendSend := linkCheckerResendSend

	linkCheckerAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	linkCheckerResendSend = func(ctx context.Context, token string, params *resend.SendEmailRequest, options *resend.SendEmailOptions) (string, error) {
		t.Fatal("linkCheckerResendSend should not be called")
		return "", nil
	}
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			if r.URL.Host == "example.microcms.test" {
				return responseWithBody(http.StatusOK, `{
						"contents": [{"id": "article-a", "title": "Article A", "content_blocks": [{"rich_text": "<a href=\"https://ok.example/path\">OK</a><a href=\"https://blocked.example/path\">Blocked</a>"}]}],
						"totalCount": 1,
						"offset": 0,
						"limit": 100
					}`), nil
			}

			switch r.URL.Host {
			case "ok.example":
				return responseWithBody(http.StatusOK, ""), nil
			case "blocked.example":
				return responseWithBody(http.StatusForbidden, ""), nil
			}

			t.Fatalf("unexpected host = %q", r.URL.Host)
			return nil, nil
		}),
	}

	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
		linkCheckerAPIBaseURL = originalBaseURL
		linkCheckerResendSend = originalResendSend
	})

	req := httptest.NewRequest(http.MethodGet, "/api/cron/linkchecker", nil)
	req.Header.Set("Authorization", "Bearer secret")
	rec := httptest.NewRecorder()

	LinkCheckerHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", rec.Code, http.StatusOK, rec.Body.String())
	}

	gotBody := compactJSON(rec.Body.String())
	if !strings.Contains(gotBody, `"checkedCount":2`) || !strings.Contains(gotBody, `"brokenCount":0`) || !strings.Contains(gotBody, `"notified":false`) {
		t.Fatalf("body = %s", gotBody)
	}
}

func TestLinkCheckerHandlerContinuesWhenZennDeployFails(t *testing.T) {
	setZennNotificationEnv(t)
	t.Setenv(cloudflarePagesDeployHookEnv, "https://deploy.example/hook")
	t.Setenv("CRON_SECRET", "secret")
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")

	originalLinkCheckerClient := linkCheckerHTTPClient
	originalBaseURL := linkCheckerAPIBaseURL
	originalZennClient := zennNotificationHTTPClient
	originalNotify := zennNotifyArticlesWithOneSignal
	originalDeployClient := cloudflarePagesDeployHTTPClient

	linkCheckerAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			if r.URL.Host != "example.microcms.test" {
				t.Fatalf("unexpected link checker host = %q", r.URL.Host)
			}
			return responseWithBody(http.StatusOK, `{
				"contents": [],
				"totalCount": 0,
				"offset": 0,
				"limit": 100
			}`), nil
		}),
	}
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
	zennNotifyArticlesWithOneSignal = func(ctx context.Context, articles []contentops.ExternalArticleNotification, now time.Time) ([]contentops.OneSignalNotificationResult, error) {
		return []contentops.OneSignalNotificationResult{
			{Sent: true, MarkerCreated: true, MarkerKey: "onesignal/notifications/zenn/zenn-a.json", NotificationID: "notification-a"},
		}, nil
	}
	cloudflarePagesDeployHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			return responseWithBody(http.StatusInternalServerError, `{"success":false}`), nil
		}),
	}

	t.Cleanup(func() {
		linkCheckerHTTPClient = originalLinkCheckerClient
		linkCheckerAPIBaseURL = originalBaseURL
		zennNotificationHTTPClient = originalZennClient
		zennNotifyArticlesWithOneSignal = originalNotify
		cloudflarePagesDeployHTTPClient = originalDeployClient
	})

	req := httptest.NewRequest(http.MethodGet, "/api/cron/linkchecker", nil)
	req.Header.Set("Authorization", "Bearer secret")
	rec := httptest.NewRecorder()

	LinkCheckerHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", rec.Code, http.StatusOK, rec.Body.String())
	}

	gotBody := compactJSON(rec.Body.String())
	for _, want := range []string{
		`"success":true`,
		`"checkedCount":0`,
		`"zennNotifications"`,
		`"newCount":1`,
		`"sentCount":1`,
		`"cloudflarePagesDeploy":{"enabled":true,"triggered":true,"statusCode":500,"error":"failed to trigger deploy"}`,
		`"error":"failed to run zenn notifications"`,
	} {
		if !strings.Contains(gotBody, want) {
			t.Fatalf("body = %s, want it to contain %s", gotBody, want)
		}
	}
}

func TestLinkCheckerHandlerReportsNotificationErrors(t *testing.T) {
	disableZennNotificationEnv(t)
	t.Setenv("CRON_SECRET", "secret")
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")
	t.Setenv("LINKCHECKER_EMAIL_TO", "owner@example.com")
	t.Setenv("LINKCHECKER_EMAIL_FROM", "sender@example.com")
	t.Setenv("LINKCHECKER_RESEND_API_KEY", "resend-token")
	setLinkCheckerLookup(t, publicLinkCheckerLookup)

	originalClient := linkCheckerHTTPClient
	originalBaseURL := linkCheckerAPIBaseURL
	originalResendSend := linkCheckerResendSend

	linkCheckerAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	linkCheckerResendSend = func(ctx context.Context, token string, params *resend.SendEmailRequest, options *resend.SendEmailOptions) (string, error) {
		return "", errors.New("resend failed")
	}
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			if r.URL.Host == "example.microcms.test" {
				return responseWithBody(http.StatusOK, `{
					"contents": [{"id": "article-a", "title": "Article A", "content_blocks": [{"rich_text": "<a href=\"https://broken.example/path\">Broken</a>"}]}],
					"totalCount": 1,
					"offset": 0,
					"limit": 100
				}`), nil
			}

			return responseWithBody(http.StatusNotFound, ""), nil
		}),
	}

	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
		linkCheckerAPIBaseURL = originalBaseURL
		linkCheckerResendSend = originalResendSend
	})

	req := httptest.NewRequest(http.MethodGet, "/api/cron/linkchecker", nil)
	req.Header.Set("Authorization", "Bearer secret")
	rec := httptest.NewRecorder()

	LinkCheckerHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d; body = %s", rec.Code, http.StatusInternalServerError, rec.Body.String())
	}
}
