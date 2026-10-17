package turnstile

import (
	"context"
	"errors"
	"io"
	"net/http"
	"strings"
	"testing"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return fn(req)
}

func stubSiteVerify(t *testing.T, handler roundTripFunc) {
	t.Helper()

	originalURL := siteVerifyURL
	originalClient := httpClient
	siteVerifyURL = "https://turnstile.example/siteverify"
	httpClient = &http.Client{Transport: handler}
	t.Cleanup(func() {
		siteVerifyURL = originalURL
		httpClient = originalClient
	})
}

func TestVerify(t *testing.T) {
	stubSiteVerify(t, func(req *http.Request) (*http.Response, error) {
		if req.Method != http.MethodPost {
			t.Fatalf("method = %s, want POST", req.Method)
		}
		if req.URL.String() != siteVerifyURL {
			t.Fatalf("url = %q, want %q", req.URL.String(), siteVerifyURL)
		}
		if err := req.ParseForm(); err != nil {
			t.Fatalf("ParseForm() error = %v", err)
		}
		for key, want := range map[string]string{
			"secret":          "test-secret",
			"response":        "turnstile-token",
			"idempotency_key": "request-id",
		} {
			if got := req.Form.Get(key); got != want {
				t.Fatalf("%s = %q, want %q", key, got, want)
			}
		}

		return &http.Response{
			StatusCode: http.StatusOK,
			Body:       io.NopCloser(strings.NewReader(`{"success":true,"hostname":"realunivlog.com","action":"contact"}`)),
			Header:     make(http.Header),
		}, nil
	})

	verified, err := Verify(context.Background(), "turnstile-token", "test-secret", "realunivlog.com", "contact", "request-id")
	if err != nil {
		t.Fatalf("Verify() error = %v", err)
	}
	if !verified {
		t.Fatal("Verify() = false, want true")
	}
}

func TestVerifyRejectsInvalidResponses(t *testing.T) {
	tests := []struct {
		name string
		body string
	}{
		{name: "unsuccessful validation", body: `{"success":false,"error-codes":["invalid-input-response"]}`},
		{name: "unexpected hostname", body: `{"success":true,"hostname":"evil.example","action":"contact"}`},
		{name: "unexpected action", body: `{"success":true,"hostname":"realunivlog.com","action":"other"}`},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			stubSiteVerify(t, func(*http.Request) (*http.Response, error) {
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(strings.NewReader(test.body)),
					Header:     make(http.Header),
				}, nil
			})

			verified, err := Verify(context.Background(), "turnstile-token", "test-secret", "realunivlog.com", "contact", "request-id")
			if err != nil {
				t.Fatalf("Verify() error = %v", err)
			}
			if verified {
				t.Fatal("Verify() = true, want false")
			}
		})
	}
}

func TestVerifyReturnsSiteVerifyErrors(t *testing.T) {
	tests := []struct {
		name string
		body string
	}{
		{name: "invalid secret", body: `{"success":false,"error-codes":["invalid-input-secret"]}`},
		{name: "internal error", body: `{"success":false,"error-codes":["internal-error"]}`},
		{name: "unknown error", body: `{"success":false}`},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			stubSiteVerify(t, func(*http.Request) (*http.Response, error) {
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(strings.NewReader(test.body)),
					Header:     make(http.Header),
				}, nil
			})

			if _, err := Verify(context.Background(), "turnstile-token", "test-secret", "realunivlog.com", "contact", "request-id"); err == nil {
				t.Fatal("Verify() error = nil, want Siteverify error")
			}
		})
	}
}

func TestVerifyReturnsRequestError(t *testing.T) {
	stubSiteVerify(t, func(*http.Request) (*http.Response, error) {
		return nil, errors.New("network error")
	})

	if _, err := Verify(context.Background(), "turnstile-token", "test-secret", "realunivlog.com", "contact", "request-id"); err == nil {
		t.Fatal("Verify() error = nil, want request error")
	}
}

func TestVerifyRejectsNonSuccessStatus(t *testing.T) {
	stubSiteVerify(t, func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: http.StatusBadGateway,
			Body:       io.NopCloser(strings.NewReader("upstream error")),
			Header:     make(http.Header),
		}, nil
	})

	if _, err := Verify(context.Background(), "turnstile-token", "test-secret", "realunivlog.com", "contact", "request-id"); err == nil {
		t.Fatal("Verify() error = nil, want HTTP status error")
	}
}

func TestVerifyReturnsDecodeError(t *testing.T) {
	stubSiteVerify(t, func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: http.StatusOK,
			Body:       io.NopCloser(strings.NewReader("{")),
			Header:     make(http.Header),
		}, nil
	})

	if _, err := Verify(context.Background(), "turnstile-token", "test-secret", "realunivlog.com", "contact", "request-id"); err == nil {
		t.Fatal("Verify() error = nil, want decode error")
	}
}
