package linkchecker

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"NextBlogApp/internal/microcms"
)

func buildMicroCMSLinkCheckerRequest(ctx context.Context, serviceDomain, apiKey string, limit, offset int) (*http.Request, error) {
	return microcms.BuildListRequest(ctx, linkCheckerAPIBaseURL, serviceDomain, apiKey, microCMSLinkCheckerFields, limit, offset)
}

func fetchMicroCMSLinkCheckerArticles(ctx context.Context, serviceDomain, apiKey string) ([]map[string]interface{}, error) {
	articles := []map[string]interface{}{}

	for offset := 0; ; offset += microCMSLinkCheckerLimit {
		req, err := buildMicroCMSLinkCheckerRequest(ctx, serviceDomain, apiKey, microCMSLinkCheckerLimit, offset)
		if err != nil {
			return nil, err
		}

		resp, err := linkCheckerHTTPClient.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
			closeResponseBody(resp)
			return nil, fmt.Errorf("microCMS returned status %d", resp.StatusCode)
		}

		var listResponse microCMSLinkCheckerListResponse
		if err := json.NewDecoder(resp.Body).Decode(&listResponse); err != nil {
			closeResponseBody(resp)
			return nil, err
		}
		closeResponseBody(resp)

		articles = append(articles, listResponse.Contents...)
		if len(articles) >= listResponse.TotalCount || len(listResponse.Contents) == 0 {
			return articles, nil
		}
	}
}
