package linkchecker

import (
	"net/http"
	"testing"
)

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
