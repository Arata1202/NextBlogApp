package linkchecker

import (
	"context"
	"io"
	"net"
	"net/http"
	"reflect"
	"strings"
	"testing"
)

func TestCheckSingleLinkBlocksPrivateResolvedAddress(t *testing.T) {
	originalClient := linkCheckerHTTPClient
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			t.Fatalf("http client should not be called for blocked targets")
			return nil, nil
		}),
	}
	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
	})
	setLinkCheckerLookup(t, func(ctx context.Context, host string) ([]net.IPAddr, error) {
		return []net.IPAddr{{IP: net.ParseIP("10.0.0.2")}}, nil
	})

	statusCode, errorMessage, broken := checkSingleLink(t.Context(), "https://private.example/path")

	if !broken {
		t.Fatal("broken = false, want true")
	}
	if statusCode != 0 {
		t.Fatalf("statusCode = %d, want 0", statusCode)
	}
	if !strings.Contains(errorMessage, "blocked link target IP") {
		t.Fatalf("errorMessage = %q, want blocked link target IP", errorMessage)
	}
}

func TestCheckSingleLinkBlocksPrivateRedirectTarget(t *testing.T) {
	originalClient := linkCheckerHTTPClient
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			switch r.URL.Host {
			case "public.example":
				return &http.Response{
					StatusCode: http.StatusFound,
					Header:     http.Header{"Location": []string{"http://private.example/metadata"}},
					Body:       io.NopCloser(strings.NewReader("")),
				}, nil
			case "private.example":
				t.Fatalf("redirect target should be blocked before request")
				return nil, nil
			default:
				t.Fatalf("unexpected host = %q", r.URL.Host)
				return nil, nil
			}
		}),
	}
	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
	})
	setLinkCheckerLookup(t, func(ctx context.Context, host string) ([]net.IPAddr, error) {
		if host == "private.example" {
			return []net.IPAddr{{IP: net.ParseIP("10.0.0.2")}}, nil
		}

		return []net.IPAddr{{IP: net.ParseIP("93.184.216.34")}}, nil
	})

	statusCode, errorMessage, broken := checkSingleLink(t.Context(), "https://public.example/start")

	if !broken {
		t.Fatal("broken = false, want true")
	}
	if statusCode != 0 {
		t.Fatalf("statusCode = %d, want 0", statusCode)
	}
	if !strings.Contains(errorMessage, "blocked link target IP") {
		t.Fatalf("errorMessage = %q, want blocked link target IP", errorMessage)
	}
}

func TestCheckSingleLinkFallsBackToGetWhenHeadReportsBroken(t *testing.T) {
	setLinkCheckerLookup(t, publicLinkCheckerLookup)

	originalClient := linkCheckerHTTPClient
	var methods []string
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			methods = append(methods, r.Method)

			switch r.Method {
			case http.MethodHead:
				return responseWithBody(http.StatusNotFound, ""), nil
			case http.MethodGet:
				return responseWithBody(http.StatusOK, ""), nil
			default:
				t.Fatalf("unexpected method = %q", r.Method)
				return nil, nil
			}
		}),
	}
	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
	})

	statusCode, errorMessage, broken := checkSingleLink(t.Context(), "https://support.example/path")

	if broken {
		t.Fatal("broken = true, want false")
	}
	if statusCode != http.StatusOK {
		t.Fatalf("statusCode = %d, want %d", statusCode, http.StatusOK)
	}
	if errorMessage != "" {
		t.Fatalf("errorMessage = %q, want empty", errorMessage)
	}
	if !reflect.DeepEqual(methods, []string{http.MethodHead, http.MethodGet}) {
		t.Fatalf("methods = %v, want HEAD then GET", methods)
	}
}

func TestCheckSingleLinkDoesNotTreatForbiddenAsBroken(t *testing.T) {
	setLinkCheckerLookup(t, publicLinkCheckerLookup)

	originalClient := linkCheckerHTTPClient
	var methods []string
	linkCheckerHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			methods = append(methods, r.Method)
			return responseWithBody(http.StatusForbidden, ""), nil
		}),
	}
	t.Cleanup(func() {
		linkCheckerHTTPClient = originalClient
	})

	statusCode, errorMessage, broken := checkSingleLink(t.Context(), "https://blocked.example/path")

	if broken {
		t.Fatal("broken = true, want false")
	}
	if statusCode != http.StatusForbidden {
		t.Fatalf("statusCode = %d, want %d", statusCode, http.StatusForbidden)
	}
	if errorMessage != "" {
		t.Fatalf("errorMessage = %q, want empty", errorMessage)
	}
	if !reflect.DeepEqual(methods, []string{http.MethodHead, http.MethodGet}) {
		t.Fatalf("methods = %v, want HEAD then GET", methods)
	}
}
