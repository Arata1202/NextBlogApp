package contentops

import (
	"net/http"
	"strings"
	"testing"
)

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
