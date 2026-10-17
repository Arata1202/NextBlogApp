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

func stubVerifyTurnstile(t *testing.T, success bool, err error) {
	t.Helper()

	originalVerify := verifyTurnstileFunc
	verifyTurnstileFunc = func(
		_ context.Context,
		token, secret, expectedHostname, expectedAction, idempotencyKey string,
	) (bool, error) {
		if token != "turnstile-token" {
			t.Fatalf("token = %q, want %q", token, "turnstile-token")
		}
		if secret != "test-secret" {
			t.Fatal("secret was not forwarded correctly")
		}
		if expectedHostname != "realunivlog.com" {
			t.Fatalf("expected hostname = %q, want realunivlog.com", expectedHostname)
		}
		if expectedAction != contactTurnstileAction {
			t.Fatalf("expected action = %q, want %q", expectedAction, contactTurnstileAction)
		}
		if idempotencyKey != "11111111-1111-4111-8111-111111111111" {
			t.Fatalf("idempotency key = %q", idempotencyKey)
		}

		return success, err
	}
	t.Cleanup(func() {
		verifyTurnstileFunc = originalVerify
	})
}
