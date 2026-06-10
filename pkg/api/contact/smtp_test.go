package contact

import (
	"net/smtp"
	"reflect"
	"strings"
	"testing"
)

func TestSendEmail(t *testing.T) {
	t.Setenv("BASE_TITLE", "Real Univ Log")
	t.Setenv("BASE_URL", "https://example.com")
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
		"To: <owner@example.com>, <user@example.com>",
		"Subject: お問い合わせありがとうございます",
		"メールアドレス: user@example.com",
		"件名: &lt;Test subject&gt;",
		"内容: Hello<br>&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;",
		"https://example.com",
	} {
		if !strings.Contains(capturedMessage, want) {
			t.Fatalf("message does not contain %q", want)
		}
	}
}

func TestSendEmailSanitizesContentBeforeBuildingBody(t *testing.T) {
	t.Setenv("BASE_TITLE", "Real Univ Log")
	t.Setenv("BASE_URL", "")
	t.Setenv("ORIGIN_URL", "")

	var capturedMessage string

	originalSendMail := smtpSendMail
	smtpSendMail = func(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
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
		"Title\r\nBcc: attacker@example.com\x00",
		"Line 1\r\nLine 2\x00\u0085<script>alert('x')</script>",
	)
	if err != nil {
		t.Fatalf("sendEmail() error = %v", err)
	}

	messageParts := strings.SplitN(capturedMessage, "\r\n\r\n", 2)
	if len(messageParts) != 2 {
		t.Fatal("message body separator was not found")
	}

	body := messageParts[1]

	for _, unexpected := range []string{"\r", "\x00", "\u0085"} {
		if strings.Contains(body, unexpected) {
			t.Fatalf("body contains unsafe content %q: %q", unexpected, body)
		}
	}

	for _, want := range []string{
		"件名: Title Bcc: attacker@example.com",
		"内容: Line 1<br>Line 2&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;",
	} {
		if !strings.Contains(body, want) {
			t.Fatalf("body does not contain %q: %q", want, body)
		}
	}
}

func TestSendEmailRejectsHeaderInjection(t *testing.T) {
	t.Setenv("BASE_TITLE", "Real Univ Log")

	originalSendMail := smtpSendMail
	smtpSendMail = func(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
		t.Fatal("smtpSendMail should not be called for invalid recipient headers")
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
		"user@example.com\r\nBcc: attacker@example.com",
		"Subject",
		"Message",
	)
	if err == nil {
		t.Fatal("sendEmail() error = nil, want invalid address error")
	}
}
