package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
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
)

var (
	microCMSSearchHTTPClient = &http.Client{Timeout: 10 * time.Second}
	microCMSSearchAPIBaseURL = "https://%s.microcms.io/api/v1/blog"
	htmlTagPattern           = regexp.MustCompile(`<[^>]*>`)
	microCMSSearchNow        = time.Now
	microCMSSearchCache      = struct {
		sync.RWMutex
		serviceDomain string
		apiKey        string
		articles      []map[string]interface{}
		expiresAt     time.Time
	}{}
)

type microCMSSearchListResponse struct {
	Contents   []map[string]interface{} `json:"contents"`
	TotalCount int                      `json:"totalCount"`
	Offset     int                      `json:"offset"`
	Limit      int                      `json:"limit"`
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

func stripSearchHTML(value string) string {
	return strings.TrimSpace(htmlTagPattern.ReplaceAllString(html.UnescapeString(value), " "))
}

func appendSearchText(builder *strings.Builder, value interface{}) {
	text, ok := value.(string)
	if !ok || text == "" {
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

func articleSearchText(article map[string]interface{}) string {
	var builder strings.Builder

	appendSearchText(&builder, article["title"])
	appendSearchText(&builder, article["description"])
	appendBlockSearchText(&builder, article["introduction_blocks"])
	appendBlockSearchText(&builder, article["content_blocks"])

	return strings.ToLower(builder.String())
}

func articleMatchesSearchQuery(article map[string]interface{}, query string) bool {
	searchText := articleSearchText(article)
	terms := strings.Fields(strings.ToLower(stripSearchHTML(query)))
	if len(terms) == 0 {
		return false
	}

	for _, term := range terms {
		if !strings.Contains(searchText, term) {
			return false
		}
	}

	return true
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

func cloneSearchArticles(articles []map[string]interface{}) []map[string]interface{} {
	clonedArticles := make([]map[string]interface{}, len(articles))
	copy(clonedArticles, articles)
	return clonedArticles
}

func resetMicroCMSSearchCache() {
	microCMSSearchCache.Lock()
	defer microCMSSearchCache.Unlock()

	microCMSSearchCache.serviceDomain = ""
	microCMSSearchCache.apiKey = ""
	microCMSSearchCache.articles = nil
	microCMSSearchCache.expiresAt = time.Time{}
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

func filterSearchArticles(articles []map[string]interface{}, query string) []map[string]interface{} {
	matchedArticles := []map[string]interface{}{}

	for _, article := range articles {
		if articleMatchesSearchQuery(article, query) {
			matchedArticles = append(matchedArticles, article)
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

func projectSearchArticle(article map[string]interface{}) map[string]interface{} {
	projectedArticle := map[string]interface{}{}

	for key, value := range article {
		if key == "introduction_blocks" || key == "content_blocks" {
			continue
		}

		projectedArticle[key] = value
	}

	return projectedArticle
}

func projectSearchArticles(articles []map[string]interface{}) []map[string]interface{} {
	projectedArticles := make([]map[string]interface{}, 0, len(articles))

	for _, article := range articles {
		projectedArticles = append(projectedArticles, projectSearchArticle(article))
	}

	return projectedArticles
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
	paginatedArticles := projectSearchArticles(paginateSearchArticles(matchedArticles, limit, offset))

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(microCMSSearchListResponse{
		Contents:   paginatedArticles,
		TotalCount: len(matchedArticles),
		Offset:     offset,
		Limit:      limit,
	}); err != nil {
		log.Printf("Failed to encode search response: %v", err)
	}
}
