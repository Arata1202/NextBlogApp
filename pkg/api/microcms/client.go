package microcms

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
)

type ListResponse struct {
	Contents   []map[string]interface{} `json:"contents"`
	TotalCount int                      `json:"totalCount"`
	Offset     int                      `json:"offset"`
	Limit      int                      `json:"limit"`
}

var serviceLabel = regexp.MustCompile(`^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$`)

func NormalizeServiceDomain(value string) (string, error) {
	serviceDomain := strings.ToLower(strings.TrimSpace(value))
	if serviceDomain == "" {
		return "", errors.New("MICROCMS_SERVICE_DOMAIN environment variable is required")
	}

	if strings.ContainsAny(serviceDomain, "?#@\\") {
		return "", errors.New("invalid microCMS service domain")
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
	if !serviceLabel.MatchString(serviceDomain) {
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

// DoListRequest keeps the service API key on the configured endpoint.
func DoListRequest(client *http.Client, req *http.Request) (*http.Response, error) {
	fixed := *client
	fixed.CheckRedirect = func(_ *http.Request, _ []*http.Request) error { return http.ErrUseLastResponse }
	return fixed.Do(req)
}
