package contact

import (
	"context"
	"testing"
)

type fakeEmailSender struct {
	messages       []emailMessage
	idempotencyKey string
	ids            []string
	err            error
	calls          int
}

func (f *fakeEmailSender) SendBatch(_ context.Context, messages []emailMessage, idempotencyKey string) ([]string, error) {
	f.calls++
	f.messages = messages
	f.idempotencyKey = idempotencyKey
	return f.ids, f.err
}

func stubNewEmailSender(t *testing.T, expectedToken string, sender emailSender) {
	t.Helper()

	originalFactory := newEmailSenderFunc
	newEmailSenderFunc = func(token string) emailSender {
		if token != expectedToken {
			t.Fatal("Resend token was not forwarded correctly")
		}
		return sender
	}
	t.Cleanup(func() {
		newEmailSenderFunc = originalFactory
	})
}

func stubVerifyRecaptcha(t *testing.T, success bool, err error) {
	t.Helper()

	originalVerify := verifyRecaptchaFunc
	verifyRecaptchaFunc = func(response, secret string) (bool, error) {
		if response != "captcha-token" {
			t.Fatalf("response = %q, want %q", response, "captcha-token")
		}
		if secret != "test-secret" {
			t.Fatal("secret was not forwarded correctly")
		}

		return success, err
	}
	t.Cleanup(func() {
		verifyRecaptchaFunc = originalVerify
	})
}
