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

func mockZennSearchFeed(t *testing.T, body string) {
	t.Helper()

	resetZennSearchCache()
	originalClient := zennSearchHTTPClient
	zennSearchHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			if r.URL.String() != zennSearchFeedURL {
				t.Fatalf("Zenn RSS URL = %q, want %q", r.URL.String(), zennSearchFeedURL)
			}

			if got := r.Header.Get("User-Agent"); got != "NextBlogApp-Search/1.0" {
				t.Fatalf("User-Agent = %q, want %q", got, "NextBlogApp-Search/1.0")
			}

			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     http.Header{"Content-Type": []string{"application/rss+xml"}},
				Body:       io.NopCloser(strings.NewReader(body)),
			}, nil
		}),
	}
	t.Cleanup(func() {
		zennSearchHTTPClient = originalClient
		resetZennSearchCache()
	})
}

func mockZennSearchStatus(t *testing.T, statusCode int, body string) {
	t.Helper()

	resetZennSearchCache()
	originalClient := zennSearchHTTPClient
	zennSearchHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode: statusCode,
				Header:     http.Header{"Content-Type": []string{"application/rss+xml"}},
				Body:       io.NopCloser(strings.NewReader(body)),
			}, nil
		}),
	}
	t.Cleanup(func() {
		zennSearchHTTPClient = originalClient
		resetZennSearchCache()
	})
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

func TestBuildZennSearchRequestUsesAllItemsFeed(t *testing.T) {
	req, err := buildZennSearchRequest(t.Context())
	if err != nil {
		t.Fatalf("buildZennSearchRequest() error = %v", err)
	}

	if req.Method != http.MethodGet {
		t.Fatalf("method = %s, want GET", req.Method)
	}

	if req.URL.String() != "https://zenn.dev/realunivlog/feed?all=1" {
		t.Fatalf("url = %q", req.URL.String())
	}

	if got := req.Header.Get("Accept"); !strings.Contains(got, "application/rss+xml") {
		t.Fatalf("Accept = %q, want RSS accept header", got)
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

func TestZennSearchItemUsesContentEncodedForSearchOnly(t *testing.T) {
	article := zennSearchItemToArticle(zennSearchRSSItem{
		Title:          "Zenn title",
		Link:           "https://zenn.dev/realunivlog/articles/content-search",
		PubDate:        "Mon, 05 Feb 2024 00:00:00 GMT",
		Description:    "<p>Summary only</p>",
		ContentEncoded: "<p>React body</p>",
	})

	if !articleMatchesSearchQuery(article, "React") {
		t.Fatal("articleMatchesSearchQuery() = false, want true for content:encoded")
	}

	projected := projectSearchResponseArticles([]map[string]interface{}{article})
	if _, ok := projected[0][searchContentField]; ok {
		t.Fatal("projectSearchResponseArticles() exposed internal search content")
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
	mockZennSearchFeed(t, `<rss><channel></channel></rss>`)
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
						{"id":"article-a","title":"React title","description":"Title match","publishedAt":"2024-01-04T00:00:00.000Z"},
						{"id":"article-b","title":"Article B","description":"React description","publishedAt":"2024-01-03T00:00:00.000Z"},
						{"id":"article-c","title":"Article C","description":"Body match","content_blocks":[{"rich_text":"<p>React body</p>"}],"publishedAt":"2024-01-02T00:00:00.000Z"},
						{"id":"article-d","title":"Article D","description":"Ignored","tags":[{"name":"React"}],"publishedAt":"2024-01-01T00:00:00.000Z"}
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

	if got := compactJSON(rec.Body.String()); got != `{"contents":[{"description":"React description","id":"blog-article-b","publishedAt":"2024-01-03T00:00:00.000Z","source":"blog","title":"Article B","url":"/articles/article-b"},{"description":"Body match","id":"blog-article-c","publishedAt":"2024-01-02T00:00:00.000Z","source":"blog","title":"Article C","url":"/articles/article-c"}],"totalCount":3,"offset":1,"limit":2}` {
		t.Fatalf("body = %q", got)
	}
}

func TestSearchHandlerIncludesZennArticles(t *testing.T) {
	resetMicroCMSSearchCache()
	t.Cleanup(resetMicroCMSSearchCache)
	mockZennSearchFeed(t, `
		<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
			<channel>
				<item>
					<title>React Zenn</title>
					<link>https://zenn.dev/realunivlog/articles/react-zenn</link>
					<pubDate>Mon, 05 Feb 2024 00:00:00 GMT</pubDate>
					<description><![CDATA[<p>Zenn description</p>]]></description>
					<content:encoded><![CDATA[<p>React body</p><img src="https://example.com/zenn.png">]]></content:encoded>
					<media:thumbnail url="https://example.com/thumb.png"></media:thumbnail>
				</item>
				<item>
					<title>Ignored Zenn</title>
					<link>https://zenn.dev/realunivlog/articles/ignored-zenn</link>
					<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
					<description>No match</description>
				</item>
			</channel>
		</rss>
	`)
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")

	originalClient := microCMSSearchHTTPClient
	originalBaseURL := microCMSSearchAPIBaseURL
	microCMSSearchAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	microCMSSearchHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     http.Header{"Content-Type": []string{"application/json"}},
				Body: io.NopCloser(strings.NewReader(`{
					"contents":[
						{"id":"article-a","title":"React Blog","description":"Blog description","publishedAt":"2024-01-01T00:00:00.000Z"}
					],
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
	})

	req := httptest.NewRequest(http.MethodGet, "/api/search?q=React", nil)
	rec := httptest.NewRecorder()

	SearchHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	if got := compactJSON(rec.Body.String()); got != `{"contents":[{"description":"Zenn description","id":"zenn-react-zenn","publishedAt":"2024-02-05T00:00:00Z","source":"zenn","thumbnailUrl":"https://example.com/thumb.png","title":"React Zenn","url":"https://zenn.dev/realunivlog/articles/react-zenn"},{"description":"Blog description","id":"blog-article-a","publishedAt":"2024-01-01T00:00:00.000Z","source":"blog","title":"React Blog","url":"/articles/article-a"}],"totalCount":2,"offset":0,"limit":10}` {
		t.Fatalf("body = %q", got)
	}
}

func TestSearchHandlerContinuesWhenZennRSSFails(t *testing.T) {
	resetMicroCMSSearchCache()
	t.Cleanup(resetMicroCMSSearchCache)
	mockZennSearchStatus(t, http.StatusServiceUnavailable, "unavailable")
	t.Setenv("MICROCMS_SERVICE_DOMAIN", "example")
	t.Setenv("MICROCMS_API_KEY", "api-key")

	originalClient := microCMSSearchHTTPClient
	originalBaseURL := microCMSSearchAPIBaseURL
	microCMSSearchAPIBaseURL = "https://%s.microcms.test/api/v1/blog"
	microCMSSearchHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     http.Header{"Content-Type": []string{"application/json"}},
				Body: io.NopCloser(strings.NewReader(`{
					"contents":[
						{"id":"article-a","title":"React Blog","description":"Blog description","publishedAt":"2024-01-01T00:00:00.000Z"}
					],
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
	})

	req := httptest.NewRequest(http.MethodGet, "/api/search?q=React", nil)
	rec := httptest.NewRecorder()

	SearchHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	if got := compactJSON(rec.Body.String()); got != `{"contents":[{"description":"Blog description","id":"blog-article-a","publishedAt":"2024-01-01T00:00:00.000Z","source":"blog","title":"React Blog","url":"/articles/article-a"}],"totalCount":1,"offset":0,"limit":10}` {
		t.Fatalf("body = %q", got)
	}
}

func TestSearchHandlerUsesCachedMicroCMSArticles(t *testing.T) {
	resetMicroCMSSearchCache()
	t.Cleanup(resetMicroCMSSearchCache)
	mockZennSearchFeed(t, `<rss><channel></channel></rss>`)
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
