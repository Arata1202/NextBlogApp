package linkchecker

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net"
	"net/http"
	"sort"
	"strings"
	"testing"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) {
	return fn(r)
}

func responseWithBody(statusCode int, body string) *http.Response {
	return &http.Response{
		StatusCode: statusCode,
		Header:     http.Header{"Content-Type": []string{"application/json"}},
		Body:       io.NopCloser(strings.NewReader(body)),
	}
}

func compactJSON(input string) string {
	var buffer bytes.Buffer
	if err := json.Compact(&buffer, []byte(input)); err != nil {
		return input
	}

	return buffer.String()
}

func publicLinkCheckerLookup(ctx context.Context, host string) ([]net.IPAddr, error) {
	return []net.IPAddr{{IP: net.ParseIP("93.184.216.34")}}, nil
}

func setLinkCheckerLookup(t *testing.T, lookup func(context.Context, string) ([]net.IPAddr, error)) {
	t.Helper()

	originalLookup := linkCheckerLookupIPAddr
	linkCheckerLookupIPAddr = lookup
	t.Cleanup(func() {
		linkCheckerLookupIPAddr = originalLookup
	})
}

func sortStrings(values []string) []string {
	sortedValues := append([]string{}, values...)
	sort.Strings(sortedValues)
	return sortedValues
}
