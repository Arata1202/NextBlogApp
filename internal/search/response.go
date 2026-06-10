package search

import (
	"sort"
	"time"
)

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
