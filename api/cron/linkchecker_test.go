package cron

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"net/smtp"
	"reflect"
	"sort"
	"strings"
	"testing"
	"time"

	webhookapi "NextBlogApp/api/webhook"
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

func publicLinkCheckerLookup(ctx context.Context, host string) ([]net.IPAddr, error) {
	return []net.IPAddr{{IP: net.ParseIP("93.184.216.34")}}, nil
}

func setLinkCheckerLookup(t *testing.T, lookup func(context.Context, string) ([]net.IPAddr, error)) {
	t.Helper()

	originalLookup := linkCheckerLookupIPAddr
	linkCheckerLookupIPAddr = lookup
	t.Cleanup(func() {
		linkCheckerLookupIPAddr = originalLookup
	})
}

func TestBuildMicroCMSLinkCheckerRequest(t *testing.T) {
	req, err := buildMicroCMSLinkCheckerRequest(t.Context(), "example", "api-key", 10, 20)
	if err != nil {
		t.Fatalf("buildMicroCMSLinkCheckerRequest() error = %v", err)
	}

	if req.Method != http.MethodGet {
		t.Fatalf("method = %s, want GET", req.Method)
	}

	if req.URL.String() != "https://example.microcms.io/api/v1/blog?fields=id%2Ctitle%2Cintroduction_blocks%2Ccontent_blocks%2CpublishedAt%2CupdatedAt&limit=10&offset=20" {
		t.Fatalf("url = %q", req.URL.String())
	}

	if got := req.Header.Get("X-MICROCMS-API-KEY"); got != "api-key" {
		t.Fatalf("X-MICROCMS-API-KEY = %q, want %q", got, "api-key")
	}
}

func TestCollectArticleLinks(t *testing.T) {
	nonLinkedExamplesHTML := strings.Join([]string{
		`<p>Example attribute: href="https://not-linked.example/path"</p>`,
		`<pre><code>&lt;a href=&quot;https://escaped-code.example/path&quot;&gt;sample&lt;/a&gt;</code></pre>`,
		`<pre><code><a href="https://raw-code.example/path">sample</a></code></pre>`,
		`<p><code><a href="https://inline-code.example/path">sample</a></code></p>`,
		`<div class="iframely-embed"><a data-iframely-url href="https://iframely.example/embed"></a></div>`,
	}, "")

	refsByURL := collectArticleLinks(map[string]interface{}{
		"id":    "article-a",
		"title": "Article A",
		"introduction_blocks": []interface{}{
			map[string]interface{}{
				"rich_text": `<p><a href="https://external.example/a?x=1&amp;y=2#heading">External</a></p>`,
			},
		},
		"content_blocks": []interface{}{
			map[string]interface{}{
				"custom_html":  `<a href='/articles/local#section'>Local</a> [Markdown](https://markdown.example/path) <a href="mailto:user@example.com">mail</a>`,
				"article_link": map[string]interface{}{"id": "related-article"},
			},
			map[string]interface{}{
				"rich_text": nonLinkedExamplesHTML,
				"box_point": `<a href="javascript:alert(1)">ignored</a><a href="#local">anchor</a>`,
			},
		},
	}, "https://site.example")

	gotURLs := make([]string, 0, len(refsByURL))
	for linkURL := range refsByURL {
		gotURLs = append(gotURLs, linkURL)
	}

	wantURLs := []string{
		"https://external.example/a?x=1&y=2",
		"https://iframely.example/embed",
		"https://site.example/articles/local",
		"https://site.example/articles/related-article",
	}

	if !reflect.DeepEqual(sortStrings(gotURLs), wantURLs) {
		t.Fatalf("urls = %v, want %v", sortStrings(gotURLs), wantURLs)
	}

	if refsByURL["https://external.example/a?x=1&y=2"][0].Field != "introduction_blocks[0].rich_text" {
		t.Fatalf("unexpected reference = %#v", refsByURL["https://external.example/a?x=1&y=2"][0])
	}
}

func TestCheckSingleLinkBlocksPrivateResolvedAddress(t *testing.T) {
	originalClient := linkCheckerHTTPClient
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			t.Fatalf("http client should not be called for blocked targets")
			return nil, nil
		}),
	}
	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
	})
	setLinkCheckerLookup(t, func(ctx context.Context, host string) ([]net.IPAddr, error) {
		return []net.IPAddr{{IP: net.ParseIP("10.0.0.2")}}, nil
	})

	statusCode, errorMessage, broken := checkSingleLink(t.Context(), "https://private.example/path")

	if !broken {
		t.Fatal("broken = false, want true")
	}
	if statusCode != 0 {
		t.Fatalf("statusCode = %d, want 0", statusCode)
	}
	if !strings.Contains(errorMessage, "blocked link target IP") {
		t.Fatalf("errorMessage = %q, want blocked link target IP", errorMessage)
	}
}

func TestCheckSingleLinkBlocksPrivateRedirectTarget(t *testing.T) {
	originalClient := linkCheckerHTTPClient
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "public.example":
				return &http.Response{
					StatusCode: http.StatusFound,
					Header:     http.Header{"Location": []string{"http://private.example/metadata"}},
					Body:       io.NopCloser(strings.NewReader("")),
				}, nil
			case "private.example":
				t.Fatalf("redirect target should be blocked before request")
				return nil, nil
			default:
				t.Fatalf("unexpected host = %q", r.URL.Host)
				return nil, nil
			}
		}),
	}
	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
	})
	setLinkCheckerLookup(t, func(ctx context.Context, host string) ([]net.IPAddr, error) {
		if host == "private.example" {
			return []net.IPAddr{{IP: net.ParseIP("10.0.0.2")}}, nil
		}

		return []net.IPAddr{{IP: net.ParseIP("93.184.216.34")}}, nil
	})

	statusCode, errorMessage, broken := checkSingleLink(t.Context(), "https://public.example/start")

	if !broken {
		t.Fatal("broken = false, want true")
	}
	if statusCode != 0 {
		t.Fatalf("statusCode = %d, want 0", statusCode)
	}
	if !strings.Contains(errorMessage, "blocked link target IP") {
		t.Fatalf("errorMessage = %q, want blocked link target IP", errorMessage)
	}
}

func TestCheckSingleLinkFallsBackToGetWhenHeadReportsBroken(t *testing.T) {
	setLinkCheckerLookup(t, publicLinkCheckerLookup)

	originalClient := linkCheckerHTTPClient
	var methods []string
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			methods = append(methods, r.Method)

			switch r.Method {
			case http.MethodHead:
				return responseWithBody(http.StatusNotFound, ""), nil
			case http.MethodGet:
				return responseWithBody(http.StatusOK, ""), nil
			default:
				t.Fatalf("unexpected method = %q", r.Method)
				return nil, nil
			}
		}),
	}
	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
	})

	statusCode, errorMessage, broken := checkSingleLink(t.Context(), "https://support.example/path")

	if broken {
		t.Fatal("broken = true, want false")
	}
	if statusCode != http.StatusOK {
		t.Fatalf("statusCode = %d, want %d", statusCode, http.StatusOK)
	}
	if errorMessage != "" {
		t.Fatalf("errorMessage = %q, want empty", errorMessage)
	}
	if !reflect.DeepEqual(methods, []string{http.MethodHead, http.MethodGet}) {
		t.Fatalf("methods = %v, want HEAD then GET", methods)
	}
}

func sortStrings(values []string) []string {
	sortedValues := append([]string{}, values...)
	sort.Strings(sortedValues)
	return sortedValues
}

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
					"contents": [{"id": "article-a", "title": "Article A", "content_blocks": [{"rich_text": "<a href=\"https://ok.example/path\">OK</a>"}]}],
					"totalCount": 1,
					"offset": 0,
					"limit": 100
				}`), nil
			}

			if r.URL.Host == "ok.example" {
				return responseWithBody(http.StatusOK, ""), nil
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
	if !strings.Contains(gotBody, `"checkedCount":1`) || !strings.Contains(gotBody, `"brokenCount":0`) || !strings.Contains(gotBody, `"notified":false`) {
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
	zennNotifyArticlesWithOneSignal = func(ctx context.Context, articles []webhookapi.ExternalArticleNotification, now time.Time) ([]webhookapi.OneSignalNotificationResult, error) {
		return []webhookapi.OneSignalNotificationResult{
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
