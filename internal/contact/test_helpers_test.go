package contact

import (
	"testing"
)

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
