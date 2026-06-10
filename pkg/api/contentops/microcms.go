package contentops

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"NextBlogApp/pkg/api/microcms"
)

func buildMicroCMSBackupRequest(ctx context.Context, serviceDomain, apiKey string, limit, offset int) (*http.Request, error) {
	return microcms.BuildListRequest(ctx, microCMSBackupAPIBaseURL, serviceDomain, apiKey, microCMSBackupFields, limit, offset)
}

func microCMSBackupResponseTooLarge(statusCode int, bodySnippet string) bool {
	return statusCode == http.StatusBadRequest &&
		strings.Contains(strings.ToLower(bodySnippet), "response body size is too long")
}

func nextMicroCMSBackupFetchLimit(currentLimit int) int {
	nextLimit := currentLimit / 2
	if nextLimit < microCMSBackupMinimumFetchLimit {
		return microCMSBackupMinimumFetchLimit
	}

	return nextLimit
}

func fetchMicroCMSBackupArticles(ctx context.Context, serviceDomain, apiKey string) ([]map[string]interface{}, error) {
	articles := []map[string]interface{}{}
	limit := microCMSBackupFetchLimit

	for offset := 0; ; {
		req, err := buildMicroCMSBackupRequest(ctx, serviceDomain, apiKey, limit, offset)
		if err != nil {
			return nil, err
		}

		resp, err := microCMSBackupHTTPClient.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
			bodySnippet := microCMSBackupResponseBodySnippet(resp)
			if microCMSBackupResponseTooLarge(resp.StatusCode, bodySnippet) && limit > microCMSBackupMinimumFetchLimit {
				limit = nextMicroCMSBackupFetchLimit(limit)
				log.Printf("microCMS backup response was too large at offset %d; retrying with limit %d", offset, limit)
				continue
			}
			if bodySnippet != "" {
				return nil, fmt.Errorf("microCMS backup returned status %d: %s", resp.StatusCode, bodySnippet)
			}
			return nil, fmt.Errorf("microCMS backup returned status %d", resp.StatusCode)
		}

		var listResponse microCMSBackupListResponse
		if err := json.NewDecoder(resp.Body).Decode(&listResponse); err != nil {
			closeMicroCMSBackupResponseBody(resp)
			return nil, err
		}
		closeMicroCMSBackupResponseBody(resp)

		articles = append(articles, listResponse.Contents...)
		if len(articles) >= listResponse.TotalCount || len(listResponse.Contents) == 0 {
			return articles, nil
		}
		offset += len(listResponse.Contents)
	}
}
