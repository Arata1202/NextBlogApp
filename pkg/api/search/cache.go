package search

import (
	"context"
	"strings"
	"time"
)

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
	microCMSSearchCache.query = ""
	microCMSSearchCache.articles = nil
	microCMSSearchCache.expiresAt = time.Time{}
}

func resetZennSearchCache() {
	zennSearchCache.Lock()
	defer zennSearchCache.Unlock()

	zennSearchCache.articles = nil
	zennSearchCache.expiresAt = time.Time{}
}

func cachedMicroCMSSearchArticles(ctx context.Context, serviceDomain, apiKey, query string) ([]map[string]interface{}, error) {
	now := microCMSSearchNow()
	normalizedQuery := strings.TrimSpace(query)

	microCMSSearchCache.RLock()
	if microCMSSearchCache.serviceDomain == serviceDomain &&
		microCMSSearchCache.apiKey == apiKey &&
		microCMSSearchCache.query == normalizedQuery &&
		now.Before(microCMSSearchCache.expiresAt) {
		articles := cloneSearchArticles(microCMSSearchCache.articles)
		microCMSSearchCache.RUnlock()
		return articles, nil
	}
	microCMSSearchCache.RUnlock()

	articles, err := fetchMicroCMSSearchArticles(ctx, serviceDomain, apiKey, query)
	if err != nil {
		return nil, err
	}

	microCMSSearchCache.Lock()
	microCMSSearchCache.serviceDomain = serviceDomain
	microCMSSearchCache.apiKey = apiKey
	microCMSSearchCache.query = normalizedQuery
	microCMSSearchCache.articles = cloneSearchArticles(articles)
	microCMSSearchCache.expiresAt = now.Add(microCMSSearchCacheTTL)
	microCMSSearchCache.Unlock()

	return articles, nil
}

func cachedZennSearchArticles(ctx context.Context) ([]map[string]interface{}, error) {
	for {
		zennSearchCache.Lock()
		if microCMSSearchNow().Before(zennSearchCache.expiresAt) {
			articles := cloneSearchArticles(zennSearchCache.articles)
			zennSearchCache.Unlock()
			return articles, nil
		}
		if wait := zennSearchCache.refresh; wait != nil {
			zennSearchCache.Unlock()
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-wait:
				continue
			}
		}
		zennSearchCache.refresh = make(chan struct{})
		zennSearchCache.Unlock()
		articles, err := fetchZennSearchArticles(ctx)
		zennSearchCache.Lock()
		if err == nil {
			zennSearchCache.articles = cloneSearchArticles(articles)
			zennSearchCache.expiresAt = microCMSSearchNow().Add(zennSearchCacheTTL)
		}
		close(zennSearchCache.refresh)
		zennSearchCache.refresh = nil
		zennSearchCache.Unlock()
		return articles, err
	}
}
