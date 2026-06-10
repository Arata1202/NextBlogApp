package recaptcha

import (
	"errors"
	"io"
	"net/http"
	"strings"
	"testing"
)

func TestVerifyRecaptcha(t *testing.T) {
	originalURL := recaptchaVerificationURL
	originalClient := recaptchaHTTPClient
	recaptchaVerificationURL = "https://recaptcha.example/siteverify"
	recaptchaHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			if r.URL.String() != recaptchaVerificationURL {
				t.Fatalf("url = %q, want %q", r.URL.String(), recaptchaVerificationURL)
			}

			if r.Method != http.MethodPost {
				t.Fatalf("method = %s, want POST", r.Method)
			}

			if err := r.ParseForm(); err != nil {
				t.Fatalf("ParseForm() error = %v", err)
			}

			if got := r.FormValue("secret"); got != "test-secret" {
				t.Fatal("secret form value was not forwarded correctly")
			}

			if got := r.FormValue("response"); got != "captcha-token" {
				t.Fatalf("response = %q, want %q", got, "captcha-token")
			}

			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     http.Header{"Content-Type": []string{"application/json"}},
				Body:       io.NopCloser(strings.NewReader(`{"success":true}`)),
			}, nil
		}),
	}
	t.Cleanup(func() {
		recaptchaVerificationURL = originalURL
		recaptchaHTTPClient = originalClient
	})

	success, err := verifyRecaptcha("captcha-token", "test-secret")
	if err != nil {
		t.Fatalf("verifyRecaptcha() error = %v", err)
	}

	if !success {
		t.Fatal("verifyRecaptcha() success = false, want true")
	}
}

func TestVerifyRecaptchaDecodeError(t *testing.T) {
	originalURL := recaptchaVerificationURL
	originalClient := recaptchaHTTPClient
	recaptchaVerificationURL = "https://recaptcha.example/siteverify"
	recaptchaHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode: http.StatusOK,
				Body:       io.NopCloser(strings.NewReader("{")),
			}, nil
		}),
	}
	t.Cleanup(func() {
		recaptchaVerificationURL = originalURL
		recaptchaHTTPClient = originalClient
	})

	success, err := verifyRecaptcha("captcha-token", "test-secret")
	if err == nil {
		t.Fatal("verifyRecaptcha() error = nil, want error")
	}

	if success {
		t.Fatal("verifyRecaptcha() success = true, want false")
	}
}

func TestVerifyRecaptchaRequestError(t *testing.T) {
	originalURL := recaptchaVerificationURL
	originalClient := recaptchaHTTPClient
	recaptchaVerificationURL = "https://recaptcha.example/siteverify"
	recaptchaHTTPClient = &http.Client{
		Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
			return nil, errors.New("network error")
		}),
	}
	t.Cleanup(func() {
		recaptchaVerificationURL = originalURL
		recaptchaHTTPClient = originalClient
	})

	success, err := verifyRecaptcha("captcha-token", "test-secret")
	if err == nil {
		t.Fatal("verifyRecaptcha() error = nil, want error")
	}

	if success {
		t.Fatal("verifyRecaptcha() success = true, want false")
	}
}
