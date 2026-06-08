package api

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"encoding/xml"
	"errors"
	"fmt"
	"html"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"NextBlogApp/pkg/monitoring"
)

const (
	microCMSSearchFields    = "id,title,description,thumbnail,categories,tags,introduction_blocks,content_blocks,publishedAt,updatedAt"
	microCMSListFetchLimit  = 100
	microCMSSearchLimit     = 10
	microCMSSearchLimitMax  = 50
	microCMSSearchOffsetMax = 10000
	microCMSSearchCacheTTL  = 5 * time.Minute

	zennSearchFeedURL              = "https://zenn.dev/realunivlog/feed?all=1"
	zennSearchRequestTimeout       = 3 * time.Second
	zennSearchCacheTTL             = time.Hour
	zennSearchFallbackThumbnailURL = "/images/blog/title.webp"
	searchDescriptionMaxLength     = 140
	searchScoreField               = "_searchScore"
	searchContentField             = "_searchContent"
)

var (
	microCMSSearchHTTPClient = &http.Client{Timeout: 10 * time.Second}
	zennSearchHTTPClient     = &http.Client{Timeout: zennSearchRequestTimeout}
	microCMSSearchAPIBaseURL = "https://%s.microcms.io/api/v1/blog"
	htmlTagPattern           = regexp.MustCompile(`<[^>]*>`)
	htmlImageSourcePattern   = regexp.MustCompile(`(?i)<img[^>]+src=["']([^"']+)["']`)
	microCMSSearchNow        = time.Now
	microCMSSearchCache      = struct {
		sync.RWMutex
		serviceDomain string
		apiKey        string
		articles      []map[string]interface{}
		expiresAt     time.Time
	}{}
	zennSearchCache = struct {
		sync.RWMutex
		articles  []map[string]interface{}
		expiresAt time.Time
	}{}
)

type microCMSSearchListResponse struct {
	Contents   []map[string]interface{} `json:"contents"`
	TotalCount int                      `json:"totalCount"`
	Offset     int                      `json:"offset"`
	Limit      int                      `json:"limit"`
}

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

func parseSearchInt(value string, defaultValue, minValue, maxValue int) int {
	parsedValue, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}

	if parsedValue < minValue {
		return minValue
	}

	if parsedValue > maxValue {
		return maxValue
	}

	return parsedValue
}

func buildMicroCMSSearchRequest(serviceDomain, apiKey string, limit, offset int) (*http.Request, error) {
	apiURL, err := url.Parse(fmt.Sprintf(microCMSSearchAPIBaseURL, strings.TrimSpace(serviceDomain)))
	if err != nil {
		return nil, err
	}

	params := apiURL.Query()
	params.Set("limit", strconv.Itoa(limit))
	params.Set("offset", strconv.Itoa(offset))
	params.Set("fields", microCMSSearchFields)
	apiURL.RawQuery = params.Encode()

	req, err := http.NewRequest(http.MethodGet, apiURL.String(), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-MICROCMS-API-KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	return req, nil
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

func stripSearchHTML(value string) string {
	strippedText := htmlTagPattern.ReplaceAllString(html.UnescapeString(value), " ")
	return strings.Join(strings.Fields(strippedText), " ")
}

func searchStringValue(value interface{}) string {
	text, ok := value.(string)
	if !ok {
		return ""
	}

	return strings.TrimSpace(text)
}

func normalizedSearchText(value string) string {
	return strings.ToLower(stripSearchHTML(value))
}

func appendSearchText(builder *strings.Builder, value interface{}) {
	text := searchStringValue(value)
	if text == "" {
		return
	}

	builder.WriteString(" ")
	builder.WriteString(stripSearchHTML(text))
}

func appendBlockSearchText(builder *strings.Builder, value interface{}) {
	blocks, ok := value.([]interface{})
	if !ok {
		return
	}

	targetFields := []string{
		"rich_text",
		"custom_html",
		"bubble_text",
		"box_merit",
		"box_demerit",
		"box_point",
		"box_common",
	}

	for _, block := range blocks {
		blockMap, ok := block.(map[string]interface{})
		if !ok {
			continue
		}

		for _, field := range targetFields {
			appendSearchText(builder, blockMap[field])
		}
	}
}

func blockSearchText(value interface{}) string {
	var builder strings.Builder
	appendBlockSearchText(&builder, value)
	return normalizedSearchText(builder.String())
}

func articleSearchText(article map[string]interface{}) string {
	var builder strings.Builder

	appendSearchText(&builder, article["title"])
	appendSearchText(&builder, article["description"])
	appendSearchText(&builder, article[searchContentField])
	appendBlockSearchText(&builder, article["introduction_blocks"])
	appendBlockSearchText(&builder, article["content_blocks"])

	return strings.ToLower(builder.String())
}

func searchTerms(query string) []string {
	return strings.Fields(normalizedSearchText(query))
}

func truncateSearchText(text string, maxLength int) string {
	text = strings.TrimSpace(text)
	if maxLength <= 0 {
		return ""
	}

	runes := []rune(text)
	if len(runes) <= maxLength {
		return text
	}

	if maxLength <= 3 {
		return string(runes[:maxLength])
	}

	return string(runes[:maxLength-3]) + "..."
}

func articleSearchScore(article map[string]interface{}, terms []string) int {
	if len(terms) == 0 {
		return 0
	}

	searchText := articleSearchText(article)
	for _, term := range terms {
		if !strings.Contains(searchText, term) {
			return 0
		}
	}

	title := normalizedSearchText(searchStringValue(article["title"]))
	description := normalizedSearchText(searchStringValue(article["description"]))
	body := normalizedSearchText(searchStringValue(article[searchContentField])) +
		" " + blockSearchText(article["introduction_blocks"]) +
		" " + blockSearchText(article["content_blocks"])
	phrase := strings.Join(terms, " ")

	score := 0
	if title == phrase {
		score += 120
	}
	if strings.Contains(title, phrase) {
		score += 50
	}
	if strings.Contains(description, phrase) {
		score += 20
	}
	if strings.Contains(body, phrase) {
		score += 8
	}

	for _, term := range terms {
		if strings.Contains(title, term) {
			score += 30
		}
		if strings.Contains(description, term) {
			score += 12
		}
		if strings.Contains(body, term) {
			score += 4
		}
	}

	return score
}

func articleMatchesSearchQuery(article map[string]interface{}, query string) bool {
	return articleSearchScore(article, searchTerms(query)) > 0
}

func fetchMicroCMSSearchArticles(serviceDomain, apiKey string) ([]map[string]interface{}, error) {
	articles := []map[string]interface{}{}

	for offset := 0; ; offset += microCMSListFetchLimit {
		req, err := buildMicroCMSSearchRequest(serviceDomain, apiKey, microCMSListFetchLimit, offset)
		if err != nil {
			return nil, err
		}

		resp, err := microCMSSearchHTTPClient.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
			resp.Body.Close()
			return nil, fmt.Errorf("microCMS search returned status %d", resp.StatusCode)
		}

		var listResponse microCMSSearchListResponse
		if err := json.NewDecoder(resp.Body).Decode(&listResponse); err != nil {
			resp.Body.Close()
			return nil, err
		}
		resp.Body.Close()

		articles = append(articles, listResponse.Contents...)
		if len(articles) >= listResponse.TotalCount || len(listResponse.Contents) == 0 {
			return articles, nil
		}
	}
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

func cloneSearchArticles(articles []map[string]interface{}) []map[string]interface{} {
	clonedArticles := make([]map[string]interface{}, len(articles))
	copy(clonedArticles, articles)
	return clonedArticles
}

func cloneSearchArticle(article map[string]interface{}) map[string]interface{} {
	clonedArticle := make(map[string]interface{}, len(article))
	for key, value := range article {
		clonedArticle[key] = value
	}

	return clonedArticle
}

func resetMicroCMSSearchCache() {
	microCMSSearchCache.Lock()
	defer microCMSSearchCache.Unlock()

	microCMSSearchCache.serviceDomain = ""
	microCMSSearchCache.apiKey = ""
	microCMSSearchCache.articles = nil
	microCMSSearchCache.expiresAt = time.Time{}
}

func resetZennSearchCache() {
	zennSearchCache.Lock()
	defer zennSearchCache.Unlock()

	zennSearchCache.articles = nil
	zennSearchCache.expiresAt = time.Time{}
}

func cachedMicroCMSSearchArticles(serviceDomain, apiKey string) ([]map[string]interface{}, error) {
	now := microCMSSearchNow()

	microCMSSearchCache.RLock()
	if microCMSSearchCache.serviceDomain == serviceDomain &&
		microCMSSearchCache.apiKey == apiKey &&
		now.Before(microCMSSearchCache.expiresAt) {
		articles := cloneSearchArticles(microCMSSearchCache.articles)
		microCMSSearchCache.RUnlock()
		return articles, nil
	}
	microCMSSearchCache.RUnlock()

	articles, err := fetchMicroCMSSearchArticles(serviceDomain, apiKey)
	if err != nil {
		return nil, err
	}

	microCMSSearchCache.Lock()
	microCMSSearchCache.serviceDomain = serviceDomain
	microCMSSearchCache.apiKey = apiKey
	microCMSSearchCache.articles = cloneSearchArticles(articles)
	microCMSSearchCache.expiresAt = now.Add(microCMSSearchCacheTTL)
	microCMSSearchCache.Unlock()

	return articles, nil
}

func cachedZennSearchArticles(ctx context.Context) ([]map[string]interface{}, error) {
	now := microCMSSearchNow()

	zennSearchCache.RLock()
	if now.Before(zennSearchCache.expiresAt) {
		articles := cloneSearchArticles(zennSearchCache.articles)
		zennSearchCache.RUnlock()
		return articles, nil
	}
	zennSearchCache.RUnlock()

	articles, err := fetchZennSearchArticles(ctx)
	if err != nil {
		return nil, err
	}

	zennSearchCache.Lock()
	zennSearchCache.articles = cloneSearchArticles(articles)
	zennSearchCache.expiresAt = now.Add(zennSearchCacheTTL)
	zennSearchCache.Unlock()

	return articles, nil
}

func requestZennSearchArticles(ctx context.Context) <-chan zennSearchResult {
	resultCh := make(chan zennSearchResult, 1)

	go func() {
		articles, err := cachedZennSearchArticles(ctx)
		resultCh <- zennSearchResult{articles: articles, err: err}
	}()

	return resultCh
}

func filterSearchArticles(articles []map[string]interface{}, query string) []map[string]interface{} {
	matchedArticles := []map[string]interface{}{}
	terms := searchTerms(query)

	for _, article := range articles {
		score := articleSearchScore(article, terms)
		if score > 0 {
			matchedArticle := cloneSearchArticle(article)
			matchedArticle[searchScoreField] = score
			matchedArticles = append(matchedArticles, matchedArticle)
		}
	}

	return matchedArticles
}

func paginateSearchArticles(articles []map[string]interface{}, limit, offset int) []map[string]interface{} {
	if offset >= len(articles) {
		return []map[string]interface{}{}
	}

	end := offset + limit
	if end > len(articles) {
		end = len(articles)
	}

	return articles[offset:end]
}

func searchArticleTime(article map[string]interface{}) time.Time {
	for _, key := range []string{"publishedAt", "updatedAt"} {
		value := searchStringValue(article[key])
		if value == "" {
			continue
		}

		for _, layout := range []string{time.RFC3339Nano, time.RFC3339, time.RFC1123Z, time.RFC1123} {
			parsed, err := time.Parse(layout, value)
			if err == nil {
				return parsed
			}
		}
	}

	return time.Time{}
}

func combineSearchArticles(articleGroups ...[]map[string]interface{}) []map[string]interface{} {
	totalLength := 0
	for _, articles := range articleGroups {
		totalLength += len(articles)
	}

	combinedArticles := make([]map[string]interface{}, 0, totalLength)
	for _, articles := range articleGroups {
		combinedArticles = append(combinedArticles, articles...)
	}

	sort.SliceStable(combinedArticles, func(i, j int) bool {
		leftScore, _ := combinedArticles[i][searchScoreField].(int)
		rightScore, _ := combinedArticles[j][searchScoreField].(int)
		if leftScore != rightScore {
			return leftScore > rightScore
		}

		leftPublishedAt := searchArticleTime(combinedArticles[i])
		rightPublishedAt := searchArticleTime(combinedArticles[j])

		if leftPublishedAt.Equal(rightPublishedAt) {
			return searchStringValue(combinedArticles[i]["url"]) < searchStringValue(combinedArticles[j]["url"])
		}

		if leftPublishedAt.IsZero() {
			return false
		}

		if rightPublishedAt.IsZero() {
			return true
		}

		return leftPublishedAt.After(rightPublishedAt)
	})

	return combinedArticles
}

func projectSearchResponseArticles(articles []map[string]interface{}) []map[string]interface{} {
	projectedArticles := make([]map[string]interface{}, 0, len(articles))

	for _, article := range articles {
		projectedArticle := cloneSearchArticle(article)
		delete(projectedArticle, searchScoreField)
		delete(projectedArticle, searchContentField)
		projectedArticles = append(projectedArticles, projectedArticle)
	}

	return projectedArticles
}

func microCMSSearchArticleToUnifiedArticle(article map[string]interface{}) map[string]interface{} {
	contentID := searchStringValue(article["id"])
	publishedAt := searchStringValue(article["publishedAt"])
	if publishedAt == "" {
		publishedAt = searchStringValue(article["updatedAt"])
	}

	unifiedArticle := map[string]interface{}{
		"id":          "blog-" + contentID,
		"title":       searchStringValue(article["title"]),
		"description": searchStringValue(article["description"]),
		"publishedAt": publishedAt,
		"url":         "/articles/" + contentID,
		"source":      "blog",
	}

	if updatedAt := searchStringValue(article["updatedAt"]); updatedAt != "" {
		unifiedArticle["updatedAt"] = updatedAt
	}

	if thumbnail, ok := article["thumbnail"]; ok && thumbnail != nil {
		unifiedArticle["thumbnail"] = thumbnail

		if thumbnailMap, ok := thumbnail.(map[string]interface{}); ok {
			if thumbnailURL := searchStringValue(thumbnailMap["url"]); thumbnailURL != "" {
				unifiedArticle["thumbnailUrl"] = thumbnailURL
			}
		}
	}

	if score, ok := article[searchScoreField].(int); ok {
		unifiedArticle[searchScoreField] = score
	}

	return unifiedArticle
}

func microCMSSearchArticlesToUnifiedArticles(articles []map[string]interface{}) []map[string]interface{} {
	unifiedArticles := make([]map[string]interface{}, 0, len(articles))

	for _, article := range articles {
		unifiedArticles = append(unifiedArticles, microCMSSearchArticleToUnifiedArticle(article))
	}

	return unifiedArticles
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

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	if !setCORSHeaders(w, r, "GET, OPTIONS") {
		return
	}
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	query := strings.TrimSpace(r.URL.Query().Get("q"))
	if query == "" {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"contents":[],"totalCount":0,"offset":0,"limit":0}`))
		return
	}

	serviceDomain := os.Getenv("MICROCMS_SERVICE_DOMAIN")
	apiKey := os.Getenv("MICROCMS_API_KEY")
	if serviceDomain == "" || apiKey == "" {
		monitoring.CaptureError(errors.New("microCMS search environment variables missing"), monitoring.EventContext{
			Feature:   "search",
			Operation: "load_microcms_env",
			Request:   r,
		})
		http.Error(w, `{"message":"microCMS environment variables missing"}`, http.StatusInternalServerError)
		return
	}

	limit := parseSearchInt(r.URL.Query().Get("limit"), microCMSSearchLimit, 1, microCMSSearchLimitMax)
	offset := parseSearchInt(r.URL.Query().Get("offset"), 0, 0, microCMSSearchOffsetMax)

	zennContext, zennCancel := context.WithTimeout(r.Context(), zennSearchRequestTimeout)
	defer zennCancel()
	zennResultCh := requestZennSearchArticles(zennContext)

	articles, err := cachedMicroCMSSearchArticles(serviceDomain, apiKey)
	if err != nil {
		log.Printf("Failed to request microCMS search: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "search",
			Operation: "fetch_microcms_articles",
			Request:   r,
		})
		http.Error(w, `{"message":"failed to request search"}`, http.StatusBadGateway)
		return
	}

	matchedArticles := filterSearchArticles(articles, query)
	matchedBlogArticles := microCMSSearchArticlesToUnifiedArticles(matchedArticles)

	matchedZennArticles := []map[string]interface{}{}
	zennResult := <-zennResultCh
	if zennResult.err != nil {
		log.Printf("Failed to request Zenn search: %v", zennResult.err)
		monitoring.CaptureError(zennResult.err, monitoring.EventContext{
			Feature:   "search",
			Operation: "fetch_zenn_articles",
			Request:   r,
		})
	} else {
		matchedZennArticles = filterSearchArticles(zennResult.articles, query)
	}

	matchedUnifiedArticles := combineSearchArticles(matchedBlogArticles, matchedZennArticles)
	paginatedArticles := projectSearchResponseArticles(paginateSearchArticles(matchedUnifiedArticles, limit, offset))

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(microCMSSearchListResponse{
		Contents:   paginatedArticles,
		TotalCount: len(matchedUnifiedArticles),
		Offset:     offset,
		Limit:      limit,
	}); err != nil {
		log.Printf("Failed to encode search response: %v", err)
	}
}
