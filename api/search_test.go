package api

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

func compactJSON(input string) string {
	var buffer bytes.Buffer
	if err := json.Compact(&buffer, []byte(input)); err != nil {
		return input
	}

	return buffer.String()
}

func TestBuildMicroCMSSearchRequest(t *testing.T) {
	req, err := buildMicroCMSSearchRequest("example", "api-key", 10, 20)
	if err != nil {
		t.Fatalf("buildMicroCMSSearchRequest() error = %v", err)
	}

	if req.Method != http.MethodGet {
		t.Fatalf("method = %s, want GET", req.Method)
	}

	if req.URL.String() != "https://example.microcms.io/api/v1/blog?fields=id%2Ctitle%2Cdescription%2Cthumbnail%2Ccategories%2Ctags%2Cintroduction_blocks%2Ccontent_blocks%2CpublishedAt%2CupdatedAt&limit=10&offset=20" {
		t.Fatalf("url = %q", req.URL.String())
	}

	if got := req.Header.Get("X-MICROCMS-API-KEY"); got != "api-key" {
		t.Fatalf("X-MICROCMS-API-KEY = %q, want %q", got, "api-key")
	}
}

func TestArticleMatchesSearchQueryTargetsLegacyFields(t *testing.T) {
	article := map[string]interface{}{
		"title":       "Title text",
		"description": "Description text",
		"tags": []interface{}{
			map[string]interface{}{"name": "Ignored tag"},
		},
		"introduction_blocks": []interface{}{
			map[string]interface{}{"rich_text": "<p>Introduction body</p>"},
			map[string]interface{}{"bubble_text": "Bubble body"},
		},
		"content_blocks": []interface{}{
			map[string]interface{}{"box_point": "<strong>Point body</strong>"},
		},
	}

	for _, query := range []string{"Title", "Description", "Introduction", "Bubble", "Point"} {
		if !articleMatchesSearchQuery(article, query) {
			t.Fatalf("articleMatchesSearchQuery(%q) = false, want true", query)
		}
	}

	if articleMatchesSearchQuery(article, "Ignored") {
		t.Fatal("articleMatchesSearchQuery() matched tag text, want false")
	}
}

func TestSearchHandlerOptions(t *testing.T) {
	t.Setenv("ORIGIN_URL", "https://example.com")

	req := httptest.NewRequest(http.MethodOptions, "/api/search", nil)
	req.Header.Set("Origin", "https://example.com")
	rec := httptest.NewRecorder()

	SearchHandler(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusNoContent)
	}

	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "https://example.com" {
		t.Fatalf("Access-Control-Allow-Origin = %q, want %q", got, "https://example.com")
	}

	if got := rec.Header().Get("Access-Control-Allow-Methods"); got != "GET, OPTIONS" {
		t.Fatalf("Access-Control-Allow-Methods = %q, want %q", got, "GET, OPTIONS")
	}
}

func TestSearchHandlerEmptyQuery(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/search", nil)
	rec := httptest.NewRecorder()

	SearchHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	if got := strings.TrimSpace(rec.Body.String()); got != `{"contents":[],"totalCount":0,"offset":0,"limit":0}` {
		t.Fatalf("body = %q", got)
	}
}

func TestSearchHandlerSuccess(t *testing.T) {
	resetMicroCMSSearchCache()
	t.Cleanup(resetMicroCMSSearchCache)
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")

	originalClient := microCMSSearchHTTPClient
	originalBaseURL := microCMSSearchAPIBaseURL
	microCMSSearchAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	microCMSSearchHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			if r.URL.Host != "example.microcms.test" {
				t.Fatalf("host = %q, want %q", r.URL.Host, "example.microcms.test")
			}

			if got := r.URL.Query().Get("q"); got != "" {
				t.Fatalf("q = %q, want empty", got)
			}

			if got := r.URL.Query().Get("limit"); got != "100" {
				t.Fatalf("limit = %q, want %q", got, "100")
			}

			if got := r.URL.Query().Get("offset"); got != "0" {
				t.Fatalf("offset = %q, want %q", got, "0")
			}

			if got := r.Header.Get("X-MICROCMS-API-KEY"); got != "api-key" {
				t.Fatalf("X-MICROCMS-API-KEY = %q, want %q", got, "api-key")
			}

			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     http.Header{"Content-Type": []string{"application/json"}},
				Body: io.NopCloser(strings.NewReader(`{
					"contents":[
						{"id":"article-a","title":"React title","description":"Title match"},
						{"id":"article-b","title":"Article B","description":"React description"},
						{"id":"article-c","title":"Article C","description":"Body match","content_blocks":[{"rich_text":"<p>React body</p>"}]},
						{"id":"article-d","title":"Article D","description":"Ignored","tags":[{"name":"React"}]}
					],
					"totalCount":4,
					"offset":0,
					"limit":100
				}`)),
			}, nil
		}),
	}
	t.Cleanup(func() {
		microCMSSearchHTTPClient = originalClient
		microCMSSearchAPIBaseURL = originalBaseURL
	})

	req := httptest.NewRequest(http.MethodGet, "/api/search?q=React&limit=2&offset=1", nil)
	rec := httptest.NewRecorder()

	SearchHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	if got := compactJSON(rec.Body.String()); got != `{"contents":[{"description":"React description","id":"article-b","title":"Article B"},{"description":"Body match","id":"article-c","title":"Article C"}],"totalCount":3,"offset":1,"limit":2}` {
		t.Fatalf("body = %q", got)
	}
}

func TestSearchHandlerUsesCachedMicroCMSArticles(t *testing.T) {
	resetMicroCMSSearchCache()
	t.Cleanup(resetMicroCMSSearchCache)
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")

	originalClient := microCMSSearchHTTPClient
	originalBaseURL := microCMSSearchAPIBaseURL
	originalNow := microCMSSearchNow
	now := time.Date(2026, time.May, 30, 12, 0, 0, 0, time.UTC)
	microCMSSearchAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	microCMSSearchNow = func() time.Time {
		return now
	}

	requestCount := 0
	microCMSSearchHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			requestCount++

			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     http.Header{"Content-Type": []string{"application/json"}},
				Body: io.NopCloser(strings.NewReader(`{
					"contents":[{"id":"article-a","title":"React cache","description":"Body"}],
					"totalCount":1,
					"offset":0,
					"limit":100
				}`)),
			}, nil
		}),
	}
	t.Cleanup(func() {
		microCMSSearchHTTPClient = originalClient
		microCMSSearchAPIBaseURL = originalBaseURL
		microCMSSearchNow = originalNow
	})

	for _, rawURL := range []string{"/api/search?q=React", "/api/search?q=Body"} {
		req := httptest.NewRequest(http.MethodGet, rawURL, nil)
		rec := httptest.NewRecorder()

		SearchHandler(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
		}
	}

	if requestCount != 1 {
		t.Fatalf("microCMS request count = %d, want 1", requestCount)
	}

	now = now.Add(microCMSSearchCacheTTL + time.Second)
	req := httptest.NewRequest(http.MethodGet, "/api/search?q=React", nil)
	rec := httptest.NewRecorder()

	SearchHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	if requestCount != 2 {
		t.Fatalf("microCMS request count after expiry = %d, want 2", requestCount)
	}
}

func TestSearchHandlerMissingEnvironment(t *testing.T) {
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "")
	t.Setenv("MICROCMS_API_KEY", "")

	req := httptest.NewRequest(http.MethodGet, "/api/search?q=React", nil)
	rec := httptest.NewRecorder()

	SearchHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}
