package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) {
	return fn(r)
}

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
				t.Fatalf("secret = %q, want %q", got, "test-secret")
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

func TestRecaptchaHandlerOptions(t *testing.T) {
	t.Setenv("ORIGIN_URL", "https://example.com")

	req := httptest.NewRequest(http.MethodOptions, "/api/recaptcha", nil)
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusNoContent)
	}

	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "https://example.com" {
		t.Fatalf("Access-Control-Allow-Origin = %q, want %q", got, "https://example.com")
	}
}

func TestRecaptchaHandlerMethodNotAllowed(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/recaptcha", nil)
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusMethodNotAllowed)
	}
}

func TestRecaptchaHandlerInvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/recaptcha", bytes.NewBufferString("{"))
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestRecaptchaHandlerMissingResponse(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/recaptcha", bytes.NewBufferString(`{}`))
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestRecaptchaHandlerMissingSecret(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "")

	req := httptest.NewRequest(http.MethodPost, "/api/recaptcha", bytes.NewBufferString(`{"g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestRecaptchaHandlerSuccess(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")

	originalVerify := verifyRecaptchaFunc
	verifyRecaptchaFunc = func(response, secret string) (bool, error) {
		if response != "captcha-token" {
			t.Fatalf("response = %q, want %q", response, "captcha-token")
		}
		if secret != "test-secret" {
			t.Fatalf("secret = %q, want %q", secret, "test-secret")
		}

		return true, nil
	}
	t.Cleanup(func() {
		verifyRecaptchaFunc = originalVerify
	})

	req := httptest.NewRequest(http.MethodPost, "/api/recaptcha", bytes.NewBufferString(`{"g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var body map[string]interface{}
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("Decode() error = %v", err)
	}

	if body["success"] != true {
		t.Fatalf("success = %v, want true", body["success"])
	}

	if body["message"] != "reCAPTCHA verified successfully" {
		t.Fatalf("message = %v, want %q", body["message"], "reCAPTCHA verified successfully")
	}
}

func TestRecaptchaHandlerVerificationFailure(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")

	originalVerify := verifyRecaptchaFunc
	verifyRecaptchaFunc = func(response, secret string) (bool, error) {
		return false, nil
	}
	t.Cleanup(func() {
		verifyRecaptchaFunc = originalVerify
	})

	req := httptest.NewRequest(http.MethodPost, "/api/recaptcha", bytes.NewBufferString(`{"g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var body map[string]interface{}
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("Decode() error = %v", err)
	}

	if body["success"] != false {
		t.Fatalf("success = %v, want false", body["success"])
	}
}

func TestRecaptchaHandlerVerificationError(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")

	originalVerify := verifyRecaptchaFunc
	verifyRecaptchaFunc = func(response, secret string) (bool, error) {
		return false, errors.New("network error")
	}
	t.Cleanup(func() {
		verifyRecaptchaFunc = originalVerify
	})

	req := httptest.NewRequest(http.MethodPost, "/api/recaptcha", bytes.NewBufferString(`{"g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}
