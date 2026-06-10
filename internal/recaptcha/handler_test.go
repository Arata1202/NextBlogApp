package recaptcha

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRecaptchaHandlerOptions(t *testing.T) {
	t.Setenv("ORIGIN_URL", "https://example.com")

	req := httptest.NewRequest(http.MethodOptions, "/api/recaptcha", nil)
	req.Header.Set("Origin", "https://example.com")
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusNoContent)
	}

	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "https://example.com" {
		t.Fatalf("Access-Control-Allow-Origin = %q, want %q", got, "https://example.com")
	}

	if got := rec.Header().Get("Access-Control-Allow-Methods"); got != "POST, OPTIONS" {
		t.Fatalf("Access-Control-Allow-Methods = %q, want %q", got, "POST, OPTIONS")
	}
}

func TestRecaptchaHandlerForbiddenOrigin(t *testing.T) {
	t.Setenv("ORIGIN_URL", "https://example.com")

	req := httptest.NewRequest(http.MethodPost, "/api/recaptcha", bytes.NewBufferString(`{}`))
	req.Header.Set("Origin", "https://evil.example")
	rec := httptest.NewRecorder()

	RecaptchaHandler(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusForbidden)
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
			t.Fatal("secret was not forwarded correctly")
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
