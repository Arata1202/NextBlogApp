package linkchecker

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"
)

func TestLiveResendNotification(t *testing.T) {
	if os.Getenv("RUN_RESEND_LIVE_TEST") != "1" {
		t.Skip("set RUN_RESEND_LIVE_TEST=1 to send a real link checker email")
	}

	uniqueURL := fmt.Sprintf("https://example.invalid/resend-live-test/%d", time.Now().UnixNano())
	links := []linkCheckResult{{
		URL:   uniqueURL,
		Error: "Resend live test (synthetic broken link)",
		References: []linkReference{{
			ArticleID:    "resend-live-test",
			ArticleTitle: "Resend実送信テスト",
			Field:        "test",
		}},
	}}

	if err := sendLinkCheckerNotification(context.Background(), links); err != nil {
		t.Fatalf("sendLinkCheckerNotification() error = %v", err)
	}

	t.Logf("sent a live Resend notification for %s", uniqueURL)
}
