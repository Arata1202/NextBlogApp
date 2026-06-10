package linkchecker

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/netip"
	"net/url"
	"sort"
	"strings"
	"sync"
)

func isBlockedLinkCheckerHostname(host string) bool {
	normalizedHost := strings.TrimSuffix(strings.ToLower(strings.TrimSpace(host)), ".")
	return normalizedHost == "localhost" || strings.HasSuffix(normalizedHost, ".localhost")
}

func isBlockedLinkCheckerIP(ip net.IP) bool {
	addr, ok := netip.AddrFromSlice(ip)
	if !ok {
		return true
	}

	addr = addr.Unmap()
	for _, prefix := range linkCheckerBlockedIPPrefixes {
		if prefix.Contains(addr) {
			return true
		}
	}

	return addr.IsUnspecified() ||
		addr.IsLoopback() ||
		addr.IsPrivate() ||
		addr.IsLinkLocalUnicast() ||
		addr.IsMulticast()
}

func validateLinkCheckerTarget(ctx context.Context, linkURL string) error {
	parsedURL, err := url.Parse(linkURL)
	if err != nil {
		return err
	}

	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		return fmt.Errorf("unsupported link scheme %q", parsedURL.Scheme)
	}

	host := parsedURL.Hostname()
	if host == "" {
		return errors.New("link target host is missing")
	}

	if isBlockedLinkCheckerHostname(host) {
		return fmt.Errorf("blocked link target host %q", host)
	}

	if ip := net.ParseIP(host); ip != nil {
		if isBlockedLinkCheckerIP(ip) {
			return fmt.Errorf("blocked link target IP %q", host)
		}
		return nil
	}

	if linkCheckerLookupIPAddr == nil {
		return errors.New("link checker resolver is unavailable")
	}

	ips, err := linkCheckerLookupIPAddr(ctx, host)
	if err != nil {
		return fmt.Errorf("resolve link target %q: %w", host, err)
	}
	if len(ips) == 0 {
		return fmt.Errorf("resolve link target %q: no addresses", host)
	}

	for _, ip := range ips {
		if isBlockedLinkCheckerIP(ip.IP) {
			return fmt.Errorf("blocked link target IP %q for host %q", ip.IP.String(), host)
		}
	}

	return nil
}

func linkCheckerDoWithoutRedirects(req *http.Request) (*http.Response, error) {
	baseClient := http.DefaultClient
	if linkCheckerHTTPClient != nil {
		baseClient = linkCheckerHTTPClient
	}

	copiedClient := *baseClient
	copiedClient.CheckRedirect = func(req *http.Request, via []*http.Request) error {
		return http.ErrUseLastResponse
	}

	return copiedClient.Do(req)
}

func isLinkCheckerRedirectStatus(statusCode int) bool {
	switch statusCode {
	case http.StatusMovedPermanently,
		http.StatusFound,
		http.StatusSeeOther,
		http.StatusTemporaryRedirect,
		http.StatusPermanentRedirect:
		return true
	default:
		return false
	}
}

func resolveLinkCheckerRedirectURL(currentURL, location string) (string, error) {
	parsedCurrentURL, err := url.Parse(currentURL)
	if err != nil {
		return "", err
	}

	parsedLocation, err := url.Parse(strings.TrimSpace(location))
	if err != nil {
		return "", err
	}

	return parsedCurrentURL.ResolveReference(parsedLocation).String(), nil
}

func doLinkCheckerRequest(ctx context.Context, method, linkURL string) (int, error) {
	currentURL := linkURL

	for redirectCount := 0; ; redirectCount++ {
		if err := validateLinkCheckerTarget(ctx, currentURL); err != nil {
			return 0, err
		}

		req, err := http.NewRequestWithContext(ctx, method, currentURL, nil)
		if err != nil {
			return 0, err
		}

		req.Header.Set("User-Agent", "NextBlogApp-LinkChecker/1.0")
		req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")

		resp, err := linkCheckerDoWithoutRedirects(req)
		if err != nil {
			return 0, err
		}

		statusCode := resp.StatusCode
		location := resp.Header.Get("Location")
		closeResponseBody(resp)

		if !isLinkCheckerRedirectStatus(statusCode) || strings.TrimSpace(location) == "" {
			return statusCode, nil
		}

		if redirectCount >= linkCheckerMaxRedirects {
			return 0, fmt.Errorf("too many redirects")
		}

		currentURL, err = resolveLinkCheckerRedirectURL(currentURL, location)
		if err != nil {
			return 0, err
		}
	}

}

func isBrokenStatus(statusCode int) bool {
	return statusCode >= http.StatusBadRequest
}

func checkSingleLink(ctx context.Context, linkURL string) (int, string, bool) {
	requestContext, cancel := context.WithTimeout(ctx, linkCheckerRequestTimeout)
	defer cancel()

	statusCode, err := doLinkCheckerRequest(requestContext, http.MethodHead, linkURL)
	if err != nil ||
		statusCode == http.StatusForbidden ||
		statusCode == http.StatusMethodNotAllowed ||
		isBrokenStatus(statusCode) {
		statusCode, err = doLinkCheckerRequest(requestContext, http.MethodGet, linkURL)
	}

	if err != nil {
		return 0, err.Error(), true
	}

	return statusCode, "", isBrokenStatus(statusCode)
}

func checkLinks(ctx context.Context, refsByURL map[string][]linkReference) []linkCheckResult {
	urls := make([]string, 0, len(refsByURL))
	for linkURL := range refsByURL {
		urls = append(urls, linkURL)
	}
	sort.Strings(urls)

	if len(urls) == 0 {
		return []linkCheckResult{}
	}

	workerCount := linkCheckerMaxConcurrency
	if len(urls) < workerCount {
		workerCount = len(urls)
	}

	jobs := make(chan string)
	results := make(chan linkCheckResult, len(urls))
	var waitGroup sync.WaitGroup

	for i := 0; i < workerCount; i++ {
		waitGroup.Add(1)
		go func() {
			defer waitGroup.Done()

			for {
				select {
				case <-ctx.Done():
					return
				case linkURL, ok := <-jobs:
					if !ok {
						return
					}

					statusCode, errorMessage, broken := checkSingleLink(ctx, linkURL)
					result := linkCheckResult{
						URL:        linkURL,
						StatusCode: statusCode,
						Error:      errorMessage,
						References: refsByURL[linkURL],
						broken:     broken,
					}

					select {
					case results <- result:
					case <-ctx.Done():
						return
					}
				}
			}
		}()
	}

	go func() {
		defer close(jobs)
		for _, linkURL := range urls {
			select {
			case jobs <- linkURL:
			case <-ctx.Done():
				return
			}
		}
	}()

	waitGroup.Wait()
	close(results)

	checkedLinks := make([]linkCheckResult, 0, len(urls))
	for result := range results {
		checkedLinks = append(checkedLinks, result)
	}

	sort.Slice(checkedLinks, func(i, j int) bool {
		return checkedLinks[i].URL < checkedLinks[j].URL
	})

	return checkedLinks
}

func brokenLinks(results []linkCheckResult) []linkCheckResult {
	links := []linkCheckResult{}

	for _, result := range results {
		if result.broken {
			result.broken = false
			links = append(links, result)
		}
	}

	return links
}
