package microcms

import (
	"net/http"
	"testing"
)

func TestNormalizeServiceDomain(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{name: "service id", input: "example", want: "example"},
		{name: "host", input: "example.microcms.io", want: "example"},
		{name: "url", input: "https://example.microcms.io/api/v1/blog", want: "example"},
		{name: "path suffix", input: "example.microcms.io/api/v1", want: "example"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := NormalizeServiceDomain(tt.input)
			if err != nil {
				t.Fatalf("NormalizeServiceDomain() error = %v", err)
			}
			if got != tt.want {
				t.Fatalf("NormalizeServiceDomain() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestNormalizeServiceDomainRejectsInvalidValue(t *testing.T) {
	for _, input := range []string{"", "https:///broken", "/path-only"} {
		t.Run(input, func(t *testing.T) {
			if _, err := NormalizeServiceDomain(input); err == nil {
				t.Fatal("NormalizeServiceDomain() error = nil, want error")
			}
		})
	}
}

func TestBuildListRequest(t *testing.T) {
	req, err := BuildListRequest(
		t.Context(),
		"https://%s.microcms.io/api/v1/blog",
		"https://example.microcms.io/api/v1",
		"api-key",
		"id,title",
		10,
		20,
	)
	if err != nil {
		t.Fatalf("BuildListRequest() error = %v", err)
	}

	if req.Method != http.MethodGet {
		t.Fatalf("method = %s, want GET", req.Method)
	}
	if req.URL.String() != "https://example.microcms.io/api/v1/blog?fields=id%2Ctitle&limit=10&offset=20" {
		t.Fatalf("url = %q", req.URL.String())
	}
	if got := req.Header.Get("X-MICROCMS-API-KEY"); got != "api-key" {
		t.Fatalf("X-MICROCMS-API-KEY = %q, want api-key", got)
	}
	if got := req.Header.Get("Accept"); got != "application/json" {
		t.Fatalf("Accept = %q, want application/json", got)
	}
}
