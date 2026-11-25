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

	type ranked struct {
		article map[string]interface{}
		score   int
		date    time.Time
		url     string
	}
	rows := make([]ranked, 0, totalLength)
	for _, group := range articleGroups {
		for _, article := range group {
			score, _ := article[searchScoreField].(int)
			rows = append(rows, ranked{article: article, score: score, date: searchArticleTime(article), url: searchStringValue(article["url"])})
		}
	}
	sort.SliceStable(rows, func(i, j int) bool {
		a, b := rows[i], rows[j]
		if a.score != b.score {
			return a.score > b.score
		}
		if !a.date.Equal(b.date) {
			return a.date.After(b.date)
		}
		return a.url < b.url
	})
	combinedArticles := make([]map[string]interface{}, len(rows))
	for i, row := range rows {
		combinedArticles[i] = row.article
	}
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
