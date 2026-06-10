package contact

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestSendEmailHandlerOptions(t *testing.T) {
	t.Setenv("ORIGIN_URL", "https://example.com")

	req := httptest.NewRequest(http.MethodOptions, "/api/sendemail", nil)
	req.Header.Set("Origin", "https://example.com")
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

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

func TestSendEmailHandlerForbiddenOrigin(t *testing.T) {
	t.Setenv("ORIGIN_URL", "https://example.com")

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{}`))
	req.Header.Set("Origin", "https://evil.example")
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusForbidden)
	}
}

func TestSendEmailHandlerMethodNotAllowed(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/sendemail", nil)
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusMethodNotAllowed)
	}

	var body map[string]string
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("Decode() error = %v", err)
	}

	if body["status"] != "Method Not Allowed" {
		t.Fatalf("status body = %q, want %q", body["status"], "Method Not Allowed")
	}
}

func TestSendEmailHandlerInvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString("{"))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestSendEmailHandlerMissingRequiredFields(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}

	var body map[string]string
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("Decode() error = %v", err)
	}

	if body["status"] != "Missing required fields" {
		t.Fatalf("status body = %q, want %q", body["status"], "Missing required fields")
	}
}

func TestSendEmailHandlerMissingRecaptchaResponse(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}

	var body map[string]string
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("Decode() error = %v", err)
	}

	if body["status"] != "Missing reCAPTCHA response" {
		t.Fatalf("status body = %q, want %q", body["status"], "Missing reCAPTCHA response")
	}
}

func TestSendEmailHandlerRejectsInvalidRequestFields(t *testing.T) {
	tests := []struct {
		name string
		body string
	}{
		{
			name: "invalid email address",
			body: `{"email":"not-an-email","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "email control characters",
			body: `{"email":"user@example.com\r\nBcc: attacker@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "title control characters",
			body: `{"email":"user@example.com","title":"Test\r\nBcc: attacker@example.com","message":"Hello","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "message control characters",
			body: `{"email":"user@example.com","title":"Test","message":"Hello\u0000","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "title too long",
			body: fmt.Sprintf(
				`{"email":"user@example.com","title":"%s","message":"Hello","g-recaptcha-response":"captcha-token"}`,
				strings.Repeat("a", maxTitleLength+1),
			),
		},
		{
			name: "message too long",
			body: fmt.Sprintf(
				`{"email":"user@example.com","title":"Test","message":"%s","g-recaptcha-response":"captcha-token"}`,
				strings.Repeat("a", maxMessageLength+1),
			),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			originalVerify := verifyRecaptchaFunc
			verifyRecaptchaFunc = func(response, secret string) (bool, error) {
				t.Fatal("verifyRecaptchaFunc should not be called for invalid request fields")
				return false, nil
			}
			t.Cleanup(func() {
				verifyRecaptchaFunc = originalVerify
			})

			req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(tt.body))
			rec := httptest.NewRecorder()

			SendEmailHandler(rec, req)

			if rec.Code != http.StatusBadRequest {
				t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
			}

			var body map[string]string
			if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
				t.Fatalf("Decode() error = %v", err)
			}

			if body["status"] != "Invalid request fields" {
				t.Fatalf("status body = %q, want %q", body["status"], "Invalid request fields")
			}
		})
	}
}

func TestSendEmailHandlerRecaptchaVerificationFailure(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	stubVerifyRecaptcha(t, false, nil)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusForbidden)
	}
}

func TestSendEmailHandlerRecaptchaVerificationError(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	stubVerifyRecaptcha(t, false, errors.New("network error"))

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestSendEmailHandlerMissingEnvironment(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	t.Setenv("EMAIL_TO", "")
	t.Setenv("EMAIL_FROM", "")
	t.Setenv("SMTP_USER", "")
	t.Setenv("SMTP_PASS", "")
	stubVerifyRecaptcha(t, true, nil)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestSendEmailHandlerSuccess(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	t.Setenv("EMAIL_TO", "owner@example.com")
	t.Setenv("EMAIL_FROM", "from@example.com")
	t.Setenv("SMTP_USER", "smtp-user")
	t.Setenv("SMTP_PASS", "smtp-pass")
	stubVerifyRecaptcha(t, true, nil)

	originalSendEmail := sendEmailFunc
	sendEmailFunc = func(emailTo, emailFrom, smtpUser, smtpPass, userEmail, title, message string) error {
		if emailTo != "owner@example.com" {
			t.Fatalf("emailTo = %q, want %q", emailTo, "owner@example.com")
		}
		if emailFrom != "from@example.com" {
			t.Fatalf("emailFrom = %q, want %q", emailFrom, "from@example.com")
		}
		if smtpUser != "smtp-user" {
			t.Fatalf("smtpUser = %q, want %q", smtpUser, "smtp-user")
		}
		if smtpPass != "smtp-pass" {
			t.Fatal("smtpPass was not forwarded correctly")
		}
		if userEmail != "user@example.com" {
			t.Fatalf("userEmail = %q, want %q", userEmail, "user@example.com")
		}
		if title != "Test" {
			t.Fatalf("title = %q, want %q", title, "Test")
		}
		if message != "Hello" {
			t.Fatalf("message = %q, want %q", message, "Hello")
		}

		return nil
	}
	t.Cleanup(func() {
		sendEmailFunc = originalSendEmail
	})

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var body map[string]bool
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("Decode() error = %v", err)
	}

	if !body["success"] {
		t.Fatalf("success = %v, want true", body["success"])
	}
}

func TestSendEmailHandlerTrimsEmailBeforeSending(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	t.Setenv("EMAIL_TO", "owner@example.com")
	t.Setenv("EMAIL_FROM", "from@example.com")
	t.Setenv("SMTP_USER", "smtp-user")
	t.Setenv("SMTP_PASS", "smtp-pass")
	stubVerifyRecaptcha(t, true, nil)

	originalSendEmail := sendEmailFunc
	sendEmailFunc = func(emailTo, emailFrom, smtpUser, smtpPass, userEmail, title, message string) error {
		if userEmail != "user@example.com" {
			t.Fatalf("userEmail = %q, want %q", userEmail, "user@example.com")
		}

		return nil
	}
	t.Cleanup(func() {
		sendEmailFunc = originalSendEmail
	})

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":" user@example.com ","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}
}

func TestSendEmailHandlerSendError(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	t.Setenv("EMAIL_TO", "owner@example.com")
	t.Setenv("EMAIL_FROM", "from@example.com")
	t.Setenv("SMTP_USER", "smtp-user")
	t.Setenv("SMTP_PASS", "smtp-pass")
	stubVerifyRecaptcha(t, true, nil)

	originalSendEmail := sendEmailFunc
	sendEmailFunc = func(emailTo, emailFrom, smtpUser, smtpPass, userEmail, title, message string) error {
		return errors.New("smtp error")
	}
	t.Cleanup(func() {
		sendEmailFunc = originalSendEmail
	})

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}

	var body map[string]string
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("Decode() error = %v", err)
	}

	if body["status"] != "fail" {
		t.Fatalf("status body = %q, want %q", body["status"], "fail")
	}
}
