package microcms

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

type ListResponse struct {
	Contents   []map[string]interface{} `json:"contents"`
	TotalCount int                      `json:"totalCount"`
	Offset     int                      `json:"offset"`
	Limit      int                      `json:"limit"`
}

func NormalizeServiceDomain(value string) (string, error) {
	serviceDomain := strings.TrimSpace(value)
	if serviceDomain == "" {
		return "", errors.New("MICROCMS_SERVICE_DOMAIN environment variable is required")
	}

	if strings.Contains(serviceDomain, "://") {
		parsedURL, err := url.Parse(serviceDomain)
		if err != nil || parsedURL.Host == "" {
			return "", errors.New("MICROCMS_SERVICE_DOMAIN must be a microCMS service domain")
		}
		serviceDomain = parsedURL.Host
	} else if slashIndex := strings.IndexAny(serviceDomain, "/\\"); slashIndex >= 0 {
		serviceDomain = serviceDomain[:slashIndex]
	}

	serviceDomain = strings.TrimSuffix(serviceDomain, ".microcms.io")
	if serviceDomain == "" || strings.ContainsAny(serviceDomain, "/\\") {
		return "", errors.New("MICROCMS_SERVICE_DOMAIN must be a microCMS service domain")
	}

	return serviceDomain, nil
}

func BuildListRequest(ctx context.Context, apiBaseURL, serviceDomain, apiKey, fields string, limit, offset int) (*http.Request, error) {
	normalizedServiceDomain, err := NormalizeServiceDomain(serviceDomain)
	if err != nil {
		return nil, err
	}

	apiURL, err := url.Parse(fmt.Sprintf(apiBaseURL, normalizedServiceDomain))
	if err != nil {
		return nil, err
	}

	params := apiURL.Query()
	params.Set("limit", strconv.Itoa(limit))
	params.Set("offset", strconv.Itoa(offset))
	params.Set("fields", fields)
	apiURL.RawQuery = params.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, apiURL.String(), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-MICROCMS-API-KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	return req, nil
}
