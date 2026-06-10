package search

import (
	"context"
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
