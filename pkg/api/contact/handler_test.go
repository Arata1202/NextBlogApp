package contact

import (
	"bytes"
	"context"
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

func TestSendEmailHandlerRejectsOversizedBody(t *testing.T) {
	validBody := `{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`
	req := httptest.NewRequest(
		http.MethodPost,
		"/api/sendemail",
		strings.NewReader(validBody+strings.Repeat(" ", maxContactRequestBodyBytes)),
	)
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusRequestEntityTooLarge)
	}
}

func TestSendEmailHandlerRejectsTrailingJSON(t *testing.T) {
	body := `{"requestId":"00000000-0000-4000-8000-000000000001"} {}`
	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", strings.NewReader(body))
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

func TestSendEmailHandlerMissingTurnstileToken(t *testing.T) {
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

	if body["status"] != "Missing Turnstile validation" {
		t.Fatalf("status body = %q, want %q", body["status"], "Missing Turnstile validation")
	}
}

func TestSendEmailHandlerRejectsInvalidRequestFields(t *testing.T) {
	tests := []struct {
		name string
		body string
	}{
		{
			name: "invalid request ID",
			body: `{"requestId":"not-a-uuid","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`,
		},
		{
			name: "invalid Turnstile validation ID",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"not-a-uuid"}`,
		},
		{
			name: "Turnstile token too long",
			body: fmt.Sprintf(
				`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"%s","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`,
				strings.Repeat("a", maxTurnstileTokenLength+1),
			),
		},
		{
			name: "invalid email address",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"not-an-email","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`,
		},
		{
			name: "email control characters",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com\r\nBcc: attacker@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`,
		},
		{
			name: "title control characters",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test\r\nBcc: attacker@example.com","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`,
		},
		{
			name: "message control characters",
			body: `{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello\u0000","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`,
		},
		{
			name: "title too long",
			body: fmt.Sprintf(
				`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"%s","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`,
				strings.Repeat("a", maxTitleLength+1),
			),
		},
		{
			name: "message too long",
			body: fmt.Sprintf(
				`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"%s","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`,
				strings.Repeat("a", maxMessageLength+1),
			),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			originalVerify := verifyTurnstileFunc
			verifyTurnstileFunc = func(
				context.Context, string, string, string, string, string,
			) (bool, error) {
				t.Fatal("verifyTurnstileFunc should not be called for invalid request fields")
				return false, nil
			}
			t.Cleanup(func() {
				verifyTurnstileFunc = originalVerify
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

func TestSendEmailHandlerMissingTurnstileConfiguration(t *testing.T) {
	tests := []struct {
		name             string
		secret           string
		expectedHostname string
	}{
		{name: "missing secret", expectedHostname: "realunivlog.com"},
		{name: "missing expected hostname", secret: "test-secret"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			t.Setenv("TURNSTILE_SECRET_KEY", test.secret)
			t.Setenv("TURNSTILE_EXPECTED_HOSTNAME", test.expectedHostname)

			originalVerify := verifyTurnstileFunc
			verifyTurnstileFunc = func(
				context.Context, string, string, string, string, string,
			) (bool, error) {
				t.Fatal("verifyTurnstileFunc should not be called without complete configuration")
				return false, nil
			}
			t.Cleanup(func() {
				verifyTurnstileFunc = originalVerify
			})

			req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`))
			rec := httptest.NewRecorder()

			SendEmailHandler(rec, req)

			if rec.Code != http.StatusInternalServerError {
				t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
			}
		})
	}
}

func TestSendEmailHandlerTurnstileVerificationFailure(t *testing.T) {
	t.Setenv("TURNSTILE_SECRET_KEY", "test-secret")
	t.Setenv("TURNSTILE_EXPECTED_HOSTNAME", "realunivlog.com")
	stubVerifyTurnstile(t, false, nil)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusForbidden)
	}
}

func TestSendEmailHandlerTurnstileVerificationError(t *testing.T) {
	t.Setenv("TURNSTILE_SECRET_KEY", "test-secret")
	t.Setenv("TURNSTILE_EXPECTED_HOSTNAME", "realunivlog.com")
	stubVerifyTurnstile(t, false, errors.New("network error"))

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestSendEmailHandlerMissingEnvironment(t *testing.T) {
	t.Setenv("TURNSTILE_SECRET_KEY", "test-secret")
	t.Setenv("TURNSTILE_EXPECTED_HOSTNAME", "realunivlog.com")
	t.Setenv("CONTACT_EMAIL_TO", "")
	t.Setenv("CONTACT_EMAIL_FROM", "")
	t.Setenv("CONTACT_RESEND_API_KEY", "")
	stubVerifyTurnstile(t, true, nil)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestSendEmailHandlerSuccess(t *testing.T) {
	t.Setenv("TURNSTILE_SECRET_KEY", "test-secret")
	t.Setenv("TURNSTILE_EXPECTED_HOSTNAME", "realunivlog.com")
	t.Setenv("CONTACT_EMAIL_TO", "owner@example.com")
	t.Setenv("CONTACT_EMAIL_FROM", "from@example.com")
	t.Setenv("CONTACT_RESEND_API_KEY", "resend-token")
	t.Setenv("BASE_TITLE", "Real Univ Log")
	stubVerifyTurnstile(t, true, nil)

	sender := &fakeEmailSender{ids: []string{"owner-id", "user-id"}}
	stubNewEmailSender(t, "resend-token", sender)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`))
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
	t.Setenv("TURNSTILE_SECRET_KEY", "test-secret")
	t.Setenv("TURNSTILE_EXPECTED_HOSTNAME", "realunivlog.com")
	t.Setenv("CONTACT_EMAIL_TO", "owner@example.com")
	t.Setenv("CONTACT_EMAIL_FROM", "from@example.com")
	t.Setenv("CONTACT_RESEND_API_KEY", "resend-token")
	stubVerifyTurnstile(t, true, nil)

	sender := &fakeEmailSender{ids: []string{"owner-id", "user-id"}}
	stubNewEmailSender(t, "resend-token", sender)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":" user@example.com ","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`))
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
	t.Setenv("TURNSTILE_SECRET_KEY", "test-secret")
	t.Setenv("TURNSTILE_EXPECTED_HOSTNAME", "realunivlog.com")
	t.Setenv("CONTACT_EMAIL_TO", "owner@example.com")
	t.Setenv("CONTACT_EMAIL_FROM", "from@example.com")
	t.Setenv("CONTACT_RESEND_API_KEY", "resend-token")
	stubVerifyTurnstile(t, true, nil)

	sender := &fakeEmailSender{err: errors.New("resend error")}
	stubNewEmailSender(t, "resend-token", sender)

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"requestId":"00000000-0000-4000-8000-000000000001","email":"user@example.com","title":"Test","message":"Hello","turnstileToken":"turnstile-token","turnstileValidationId":"11111111-1111-4111-8111-111111111111"}`))
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
