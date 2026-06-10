package search

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"testing"
)

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

func TestShouldReportZennSearchErrorIgnoresExpectedCancellation(t *testing.T) {
	if shouldReportZennSearchError(context.Canceled) {
		t.Fatal("shouldReportZennSearchError(context.Canceled) = true, want false")
	}

	if shouldReportZennSearchError(context.DeadlineExceeded) {
		t.Fatal("shouldReportZennSearchError(context.DeadlineExceeded) = true, want false")
	}

	if !shouldReportZennSearchError(errors.New("unexpected zenn failure")) {
		t.Fatal("shouldReportZennSearchError(unexpected error) = false, want true")
	}
}
