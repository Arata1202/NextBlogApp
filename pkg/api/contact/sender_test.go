package contact

import (
	"context"
	"errors"
	"strings"
	"testing"
)

func TestSendContactEmailsBuildsSeparatedMessages(t *testing.T) {
	sender := &fakeEmailSender{ids: []string{"owner-id", "user-id"}}
	request := EmailRequestBody{
		RequestID:         "00000000-0000-4000-8000-000000000001",
		Email:             "user@example.com",
		Title:             "<Test subject>",
		Message:           "Line 1\n<script>alert('x')</script>",
		RecaptchaResponse: "captcha-token",
	}

	ids, err := sendContactEmails(
		context.Background(),
		sender,
		emailConfig{To: "owner@example.com", From: "contact@example.com"},
		siteConfig{Title: "Real Univ Log", URL: "https://example.com"},
		request,
	)
	if err != nil {
		t.Fatalf("sendContactEmails() error = %v", err)
	}
	if len(ids) != 2 || ids[0] != "owner-id" || ids[1] != "user-id" {
		t.Fatalf("ids = %v", ids)
	}
	if sender.calls != 1 {
		t.Fatalf("calls = %d, want 1", sender.calls)
	}
	if len(sender.messages) != 2 {
		t.Fatalf("messages = %d, want 2", len(sender.messages))
	}

	owner := sender.messages[0]
	if owner.From.Name != "Real Univ Log" || owner.From.Address != "contact@example.com" {
		t.Fatalf("owner From = %#v", owner.From)
	}
	if len(owner.To) != 1 || owner.To[0].Address != "owner@example.com" {
		t.Fatalf("owner To = %#v", owner.To)
	}
	if owner.ReplyTo.Address != "user@example.com" {
		t.Fatalf("owner ReplyTo = %#v", owner.ReplyTo)
	}
	if owner.Subject != "【お問い合わせ】<Test subject>" {
		t.Fatalf("owner Subject = %q", owner.Subject)
	}

	confirmation := sender.messages[1]
	if len(confirmation.To) != 1 || confirmation.To[0].Address != "user@example.com" {
		t.Fatalf("confirmation To = %#v", confirmation.To)
	}
	if confirmation.ReplyTo.Address != "contact@example.com" {
		t.Fatalf("confirmation ReplyTo = %#v", confirmation.ReplyTo)
	}
	if confirmation.Subject != "お問い合わせありがとうございます" {
		t.Fatalf("confirmation Subject = %q", confirmation.Subject)
	}

	for _, message := range sender.messages {
		for _, want := range []string{
			"メールアドレス: user@example.com",
			"件名: &lt;Test subject&gt;",
			"内容: Line 1<br>&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;",
			"https://example.com",
			"Email: contact@example.com",
		} {
			if !strings.Contains(message.HTML, want) {
				t.Fatalf("HTML does not contain %q: %q", want, message.HTML)
			}
		}
		if !strings.Contains(message.Text, "Line 1\n<script>alert('x')</script>") {
			t.Fatalf("Text body does not preserve plain text content: %q", message.Text)
		}
	}

	if sender.idempotencyKey != "contact/"+request.RequestID {
		t.Fatalf("idempotency key = %q", sender.idempotencyKey)
	}
	if sender.idempotencyKey != buildIdempotencyKey(request) {
		t.Fatal("idempotency key is not deterministic")
	}
}

func TestBuildIdempotencyKeyUsesRequestID(t *testing.T) {
	request := EmailRequestBody{RequestID: "00000000-0000-4000-8000-000000000001"}

	if got := buildIdempotencyKey(request); got != "contact/"+request.RequestID {
		t.Fatalf("buildIdempotencyKey() = %q", got)
	}
}

func TestSendContactEmailsRejectsInvalidAddresses(t *testing.T) {
	sender := &fakeEmailSender{ids: []string{"owner-id", "user-id"}}
	_, err := sendContactEmails(
		context.Background(),
		sender,
		emailConfig{To: "not-an-email", From: "contact@example.com"},
		siteConfig{Title: "Real Univ Log"},
		EmailRequestBody{RequestID: "00000000-0000-4000-8000-000000000001", Email: "user@example.com", Title: "Title", Message: "Message", RecaptchaResponse: "captcha"},
	)
	if err == nil {
		t.Fatal("sendContactEmails() error = nil, want invalid address error")
	}
	if sender.calls != 0 {
		t.Fatalf("calls = %d, want 0", sender.calls)
	}
}

func TestSendContactEmailsWrapsSenderError(t *testing.T) {
	sender := &fakeEmailSender{err: errors.New("provider error")}
	_, err := sendContactEmails(
		context.Background(),
		sender,
		emailConfig{To: "owner@example.com", From: "contact@example.com"},
		siteConfig{Title: "Real Univ Log"},
		EmailRequestBody{RequestID: "00000000-0000-4000-8000-000000000001", Email: "user@example.com", Title: "Title", Message: "Message", RecaptchaResponse: "captcha"},
	)
	if err == nil || !strings.Contains(err.Error(), "send contact email batch") {
		t.Fatalf("sendContactEmails() error = %v", err)
	}
}

func TestSendContactEmailsValidatesProviderResponse(t *testing.T) {
	tests := []struct {
		name string
		ids  []string
	}{
		{name: "missing id", ids: []string{"owner-id"}},
		{name: "empty id", ids: []string{"owner-id", ""}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			sender := &fakeEmailSender{ids: tt.ids}
			_, err := sendContactEmails(
				context.Background(),
				sender,
				emailConfig{To: "owner@example.com", From: "contact@example.com"},
				siteConfig{Title: "Real Univ Log"},
				EmailRequestBody{RequestID: "00000000-0000-4000-8000-000000000001", Email: "user@example.com", Title: "Title", Message: "Message", RecaptchaResponse: "captcha"},
			)
			if err == nil {
				t.Fatal("sendContactEmails() error = nil, want provider response error")
			}
		})
	}
}
