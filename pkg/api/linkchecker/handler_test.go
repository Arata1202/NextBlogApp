package linkchecker

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/smtp"
	"reflect"
	"strings"
	"testing"
	"time"

	contentops "NextBlogApp/pkg/api/contentops"
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
	t.Setenv("EMAIL_TO", "owner@example.com")
	t.Setenv("EMAIL_FROM", "sender@example.com")
	t.Setenv("SMTP_USER", "sender@example.com")
	t.Setenv("SMTP_PASS", "app-password")
	setLinkCheckerLookup(t, publicLinkCheckerLookup)

	originalClient := linkCheckerHTTPClient
	originalBaseURL := linkCheckerAPIBaseURL
	originalSMTPSend := linkCheckerSMTPSend

	linkCheckerAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	var capturedSMTPAddr string
	var capturedSMTPFrom string
	var capturedSMTPTo []string
	var capturedMessage string
	linkCheckerSMTPSend = func(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
		capturedSMTPAddr = addr
		capturedSMTPFrom = from
		capturedSMTPTo = to
		capturedMessage = string(msg)
		return nil
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
		linkCheckerSMTPSend = originalSMTPSend
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

	if capturedSMTPAddr != "smtp.gmail.com:587" {
		t.Fatalf("smtp addr = %q, want smtp.gmail.com:587", capturedSMTPAddr)
	}
	if capturedSMTPFrom != "sender@example.com" {
		t.Fatalf("smtp from = %q, want sender@example.com", capturedSMTPFrom)
	}
	if !reflect.DeepEqual(capturedSMTPTo, []string{"owner@example.com"}) {
		t.Fatalf("smtp to = %v, want owner@example.com", capturedSMTPTo)
	}

	for _, want := range []string{
		"Real Univ Log",
		"https://broken.example/missing",
		"https://site.example/articles/missing",
		"Article A",
	} {
		if !strings.Contains(capturedMessage, want) {
			t.Fatalf("message does not contain %q: %s", want, capturedMessage)
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
	originalSMTPSend := linkCheckerSMTPSend

	linkCheckerAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	linkCheckerSMTPSend = func(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
		t.Fatal("linkCheckerSMTPSend should not be called")
		return nil
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
		linkCheckerSMTPSend = originalSMTPSend
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
	t.Setenv("EMAIL_TO", "owner@example.com")
	t.Setenv("EMAIL_FROM", "sender@example.com")
	t.Setenv("SMTP_USER", "sender@example.com")
	t.Setenv("SMTP_PASS", "app-password")
	setLinkCheckerLookup(t, publicLinkCheckerLookup)

	originalClient := linkCheckerHTTPClient
	originalBaseURL := linkCheckerAPIBaseURL
	originalSMTPSend := linkCheckerSMTPSend

	linkCheckerAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	linkCheckerSMTPSend = func(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
		return errors.New("smtp failed")
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
		linkCheckerSMTPSend = originalSMTPSend
	})

	req := httptest.NewRequest(http.MethodGet, "/api/cron/linkchecker", nil)
	req.Header.Set("Authorization", "Bearer secret")
	rec := httptest.NewRecorder()

	LinkCheckerHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d; body = %s", rec.Code, http.StatusInternalServerError, rec.Body.String())
	}
}
