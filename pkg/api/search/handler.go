package search

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"NextBlogApp/pkg/api/httpx"
	"NextBlogApp/pkg/api/monitoring"
)

type searchResponse struct {
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

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	if !httpx.SetCORSHeaders(w, r, "GET, OPTIONS") {
		return
	}

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		httpx.WriteError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	query := strings.TrimSpace(r.URL.Query().Get("q"))
	if query == "" {
		httpx.WriteJSON(w, http.StatusOK, searchResponse{
			Contents:   []map[string]interface{}{},
			TotalCount: 0,
			Offset:     0,
			Limit:      0,
		})
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
		httpx.WriteError(w, http.StatusInternalServerError, "microCMS environment variables missing")
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
		httpx.WriteError(w, http.StatusBadGateway, "failed to request search")
		return
	}

	matchedArticles := filterSearchArticles(articles, query)
	matchedBlogArticles := microCMSSearchArticlesToUnifiedArticles(matchedArticles)

	matchedZennArticles := []map[string]interface{}{}
	zennResult := <-zennResultCh
	if zennResult.err != nil {
		if shouldReportZennSearchError(zennResult.err) {
			log.Printf("Failed to request Zenn search: %v", zennResult.err)
			monitoring.CaptureError(zennResult.err, monitoring.EventContext{
				Feature:   "search",
				Operation: "fetch_zenn_articles",
				Request:   r,
			})
		}
	} else {
		matchedZennArticles = filterSearchArticles(zennResult.articles, query)
	}

	matchedUnifiedArticles := combineSearchArticles(matchedBlogArticles, matchedZennArticles)
	paginatedArticles := projectSearchResponseArticles(paginateSearchArticles(matchedUnifiedArticles, limit, offset))

	httpx.WriteJSON(w, http.StatusOK, searchResponse{
		Contents:   paginatedArticles,
		TotalCount: len(matchedUnifiedArticles),
		Offset:     offset,
		Limit:      limit,
	})
}
