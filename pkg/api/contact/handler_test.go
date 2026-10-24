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
	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com"}`))
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
	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello"}`))
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
			name: "invalid request ID",
			body: `{"requestId":"not-a-uuid","email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "invalid email address",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"not-an-email","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "email control characters",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com\r\nBcc: attacker@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "title control characters",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test\r\nBcc: attacker@example.com","message":"Hello","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "message control characters",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello\u0000","g-recaptcha-response":"captcha-token"}`,
		},
		{
			name: "title too long",
			body: fmt.Sprintf(
				`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"%s","message":"Hello","g-recaptcha-response":"captcha-token"}`,
				strings.Repeat("a", maxTitleLength+1),
			),
		},
		{
			name: "message too long",
			body: fmt.Sprintf(
				`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"%s","g-recaptcha-response":"captcha-token"}`,
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

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusForbidden)
	}
}

func TestSendEmailHandlerRecaptchaVerificationError(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	stubVerifyRecaptcha(t, false, errors.New("network error"))

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestSendEmailHandlerMissingEnvironment(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	t.Setenv("CONTACT_EMAIL_TO", "")
	t.Setenv("CONTACT_EMAIL_FROM", "")
	t.Setenv("CONTACT_RESEND_API_KEY", "")
	stubVerifyRecaptcha(t, true, nil)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestSendEmailHandlerSuccess(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	t.Setenv("CONTACT_EMAIL_TO", "owner@example.com")
	t.Setenv("CONTACT_EMAIL_FROM", "from@example.com")
	t.Setenv("CONTACT_RESEND_API_KEY", "resend-token")
	t.Setenv("BASE_TITLE", "Real Univ Log")
	stubVerifyRecaptcha(t, true, nil)

	sender := &fakeEmailSender{ids: []string{"owner-id", "user-id"}}
	stubNewEmailSender(t, "resend-token", sender)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}
	if sender.calls != 1 || len(sender.messages) != 2 {
		t.Fatalf("sender calls = %d, messages = %d", sender.calls, len(sender.messages))
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
	t.Setenv("CONTACT_EMAIL_TO", "owner@example.com")
	t.Setenv("CONTACT_EMAIL_FROM", "from@example.com")
	t.Setenv("CONTACT_RESEND_API_KEY", "resend-token")
	stubVerifyRecaptcha(t, true, nil)

	sender := &fakeEmailSender{ids: []string{"owner-id", "user-id"}}
	stubNewEmailSender(t, "resend-token", sender)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":" user@example.com ","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}
	if got := sender.messages[0].ReplyTo.Address; got != "user@example.com" {
		t.Fatalf("ReplyTo = %q, want %q", got, "user@example.com")
	}
}

func TestSendEmailHandlerSendError(t *testing.T) {
	t.Setenv("RECAPTCHA_SECRET_KEY", "test-secret")
	t.Setenv("CONTACT_EMAIL_TO", "owner@example.com")
	t.Setenv("CONTACT_EMAIL_FROM", "from@example.com")
	t.Setenv("CONTACT_RESEND_API_KEY", "resend-token")
	stubVerifyRecaptcha(t, true, nil)

	sender := &fakeEmailSender{err: errors.New("resend error")}
	stubNewEmailSender(t, "resend-token", sender)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","g-recaptcha-response":"captcha-token"}`))
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
