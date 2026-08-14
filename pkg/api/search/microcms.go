package search

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"NextBlogApp/pkg/api/microcms"
)

type microCMSSearchListResponse = microcms.ListResponse

func buildMicroCMSSearchRequest(serviceDomain, apiKey, query string, limit, offset int) (*http.Request, error) {
	req, err := microcms.BuildListRequest(context.Background(), microCMSSearchAPIBaseURL, serviceDomain, apiKey, microCMSSearchFields, limit, offset)
	if err != nil {
		return nil, err
	}

	params := req.URL.Query()
	params.Set("q", strings.TrimSpace(query))
	req.URL.RawQuery = params.Encode()

	return req, nil
}

func fetchMicroCMSSearchArticles(serviceDomain, apiKey, query string) ([]map[string]interface{}, error) {
	articles := []map[string]interface{}{}

	for offset := 0; ; offset += microCMSListFetchLimit {
		req, err := buildMicroCMSSearchRequest(serviceDomain, apiKey, query, microCMSListFetchLimit, offset)
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

	if isSponsored, ok := article["isSponsored"].(bool); ok && isSponsored {
		unifiedArticle["isSponsored"] = true
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
