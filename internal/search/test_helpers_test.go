package search

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"testing"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) {
	return fn(r)
}

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
