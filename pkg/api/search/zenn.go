package search

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/xml"
	"errors"
	"fmt"
	"html"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type zennSearchRSSFeed struct {
	Channel zennSearchRSSChannel `xml:"channel"`
}

type zennSearchRSSChannel struct {
	Items []zennSearchRSSItem `xml:"item"`
}

type zennSearchRSSItem struct {
	Title          string                 `xml:"title"`
	Link           string                 `xml:"link"`
	PubDate        string                 `xml:"pubDate"`
	Description    string                 `xml:"description"`
	ContentEncoded string                 `xml:"encoded"`
	Enclosure      zennSearchRSSEnclosure `xml:"enclosure"`
	MediaThumbnail zennSearchRSSEnclosure `xml:"thumbnail"`
}

type zennSearchRSSEnclosure struct {
	URL string `xml:"url,attr"`
}

type zennSearchResult struct {
	articles []map[string]interface{}
	err      error
}

func buildZennSearchRequest(ctx context.Context) (*http.Request, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, zennSearchFeedURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8")
	req.Header.Set("User-Agent", "NextBlogApp-Search/1.0")

	return req, nil
}

func fetchZennSearchArticles(ctx context.Context) ([]map[string]interface{}, error) {
	req, err := buildZennSearchRequest(ctx)
	if err != nil {
		return nil, err
	}

	resp, err := zennSearchHTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("Zenn RSS returned status %d", resp.StatusCode)
	}

	var feed zennSearchRSSFeed
	if err := xml.NewDecoder(resp.Body).Decode(&feed); err != nil {
		return nil, err
	}

	return zennSearchItemsToArticles(feed.Channel.Items), nil
}

func requestZennSearchArticles(ctx context.Context) <-chan zennSearchResult {
	resultCh := make(chan zennSearchResult, 1)

	go func() {
		articles, err := cachedZennSearchArticles(ctx)
		resultCh <- zennSearchResult{articles: articles, err: err}
	}()

	return resultCh
}

func shouldReportZennSearchError(err error) bool {
	return !errors.Is(err, context.Canceled) && !errors.Is(err, context.DeadlineExceeded)
}

func parseZennSearchPubDate(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}

	for _, layout := range []string{time.RFC1123Z, time.RFC1123, time.RFC3339Nano, time.RFC3339} {
		parsed, err := time.Parse(layout, value)
		if err == nil {
			return parsed.UTC().Format(time.RFC3339)
		}
	}

	return value
}

func zennSearchArticleID(linkURL string) string {
	parsedURL, err := url.Parse(strings.TrimSpace(linkURL))
	if err == nil && strings.EqualFold(parsedURL.Hostname(), "zenn.dev") {
		segments := strings.Split(strings.Trim(parsedURL.EscapedPath(), "/"), "/")
		if len(segments) >= 3 && segments[1] == "articles" {
			if slug, err := url.PathUnescape(segments[2]); err == nil && strings.TrimSpace(slug) != "" {
				return "zenn-" + strings.TrimSpace(slug)
			}
		}
	}

	sum := sha256.Sum256([]byte(strings.TrimSpace(linkURL)))
	return "zenn-" + hex.EncodeToString(sum[:16])
}

func extractFirstSearchImage(htmlText string) string {
	matches := htmlImageSourcePattern.FindStringSubmatch(htmlText)
	if len(matches) < 2 {
		return ""
	}

	return strings.TrimSpace(html.UnescapeString(matches[1]))
}

func zennSearchThumbnailURL(item zennSearchRSSItem) string {
	for _, imageURL := range []string{
		strings.TrimSpace(item.Enclosure.URL),
		strings.TrimSpace(item.MediaThumbnail.URL),
		extractFirstSearchImage(item.ContentEncoded),
		extractFirstSearchImage(item.Description),
		zennSearchFallbackThumbnailURL,
	} {
		if imageURL != "" {
			return imageURL
		}
	}

	return zennSearchFallbackThumbnailURL
}

func zennSearchItemToArticle(item zennSearchRSSItem) map[string]interface{} {
	title := strings.TrimSpace(item.Title)
	linkURL := strings.TrimSpace(item.Link)
	descriptionHTML := strings.TrimSpace(item.Description)
	if descriptionHTML == "" {
		descriptionHTML = strings.TrimSpace(item.ContentEncoded)
	}
	searchContent := strings.TrimSpace(item.Description + " " + item.ContentEncoded)

	return map[string]interface{}{
		"id":               zennSearchArticleID(linkURL),
		"title":            title,
		"description":      truncateSearchText(stripSearchHTML(descriptionHTML), searchDescriptionMaxLength),
		"publishedAt":      parseZennSearchPubDate(item.PubDate),
		"url":              linkURL,
		"thumbnailUrl":     zennSearchThumbnailURL(item),
		"source":           "zenn",
		searchContentField: searchContent,
	}
}

func zennSearchItemsToArticles(items []zennSearchRSSItem) []map[string]interface{} {
	articles := make([]map[string]interface{}, 0, len(items))

	for _, item := range items {
		if strings.TrimSpace(item.Title) == "" || strings.TrimSpace(item.Link) == "" {
			continue
		}

		articles = append(articles, zennSearchItemToArticle(item))
	}

	return articles
}
