package contentops

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
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
