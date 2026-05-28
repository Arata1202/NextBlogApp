package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/smtp"
	"reflect"
	"strings"
	"testing"
)

func TestSendEmail(t *testing.T) {
	t.Setenv("BASE_TITLE", "Real Univ Log")
	t.Setenv("NEXT_PUBLIC_BASE_URL", "https://example.com")
	t.Setenv("ORIGIN_URL", "")

	var capturedAddr string
	var capturedFrom string
	var capturedTo []string
	var capturedMessage string

	originalSendMail := smtpSendMail
	smtpSendMail = func(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
		capturedAddr = addr
		capturedFrom = from
		capturedTo = to
		capturedMessage = string(msg)
		return nil
	}
	t.Cleanup(func() {
		smtpSendMail = originalSendMail
	})

	err := sendEmail(
		"owner@example.com",
		"from@example.com",
		"smtp-user",
		"smtp-pass",
		"user@example.com",
		"<Test subject>",
		"Hello\n<script>alert('x')</script>",
	)
	if err != nil {
		t.Fatalf("sendEmail() error = %v", err)
	}

	if capturedAddr != "smtp.gmail.com:587" {
		t.Fatalf("addr = %q, want %q", capturedAddr, "smtp.gmail.com:587")
	}

	if capturedFrom != "from@example.com" {
		t.Fatalf("from = %q, want %q", capturedFrom, "from@example.com")
	}

	wantTo := []string{"owner@example.com", "user@example.com"}
	if !reflect.DeepEqual(capturedTo, wantTo) {
		t.Fatalf("to = %v, want %v", capturedTo, wantTo)
	}

	for _, want := range []string{
		`From: "Real Univ Log" <from@example.com>`,
		"To: owner@example.com,user@example.com",
		"Subject: お問い合わせありがとうございます",
		"メールアドレス: user@example.com",
		"件名: &lt;Test subject&gt;",
		"内容: Hello<br>&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;",
		"https://example.com",
	} {
		if !strings.Contains(capturedMessage, want) {
			t.Fatalf("message does not contain %q\nmessage:\n%s", want, capturedMessage)
		}
	}
}

func TestSendEmailHandlerOptions(t *testing.T) {
	t.Setenv("ORIGIN_URL", "https://example.com")

	req := httptest.NewRequest(http.MethodOptions, "/api/sendemail", nil)
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusNoContent)
	}

	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "https://example.com" {
		t.Fatalf("Access-Control-Allow-Origin = %q, want %q", got, "https://example.com")
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

func TestSendEmailHandlerMissingEnvironment(t *testing.T) {
	t.Setenv("EMAIL_TO", "")
	t.Setenv("EMAIL_FROM", "")
	t.Setenv("SMTP_USER", "")
	t.Setenv("SMTP_PASS", "")

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}

func TestSendEmailHandlerSuccess(t *testing.T) {
	t.Setenv("EMAIL_TO", "owner@example.com")
	t.Setenv("EMAIL_FROM", "from@example.com")
	t.Setenv("SMTP_USER", "smtp-user")
	t.Setenv("SMTP_PASS", "smtp-pass")

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
			t.Fatalf("smtpPass = %q, want %q", smtpPass, "smtp-pass")
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

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello"}`))
	rec := httptest.NewRecorder()

	SendEmailHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var body map[string]string
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("Decode() error = %v", err)
	}

	if body["success"] != "success" {
		t.Fatalf("success = %q, want %q", body["success"], "success")
	}
}

func TestSendEmailHandlerSendError(t *testing.T) {
	t.Setenv("EMAIL_TO", "owner@example.com")
	t.Setenv("EMAIL_FROM", "from@example.com")
	t.Setenv("SMTP_USER", "smtp-user")
	t.Setenv("SMTP_PASS", "smtp-pass")

	originalSendEmail := sendEmailFunc
	sendEmailFunc = func(emailTo, emailFrom, smtpUser, smtpPass, userEmail, title, message string) error {
		return errors.New("smtp error")
	}
	t.Cleanup(func() {
		sendEmailFunc = originalSendEmail
	})

	req := httptest.NewRequest(http.MethodPost, "/api/sendemail", bytes.NewBufferString(`{"email":"user@example.com","title":"Test","message":"Hello"}`))
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

	if body["error"] != "smtp error" {
		t.Fatalf("error body = %q, want %q", body["error"], "smtp error")
	}
}
