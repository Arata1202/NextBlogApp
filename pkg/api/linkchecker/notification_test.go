package linkchecker

import (
	"strings"
	"testing"
)

func TestNotificationConfig(t *testing.T) {
	t.Setenv("LINKCHECKER_EMAIL_TO", " Owner <owner@example.com> ")
	t.Setenv("LINKCHECKER_EMAIL_FROM", " Sender <sender@example.com> ")
	t.Setenv("LINKCHECKER_RESEND_API_KEY", " resend-token ")

	config, err := notificationConfig()
	if err != nil {
		t.Fatalf("notificationConfig() error = %v", err)
	}
	if config.To != "owner@example.com" {
		t.Fatalf("To = %q, want owner@example.com", config.To)
	}
	if config.From != "sender@example.com" {
		t.Fatalf("From = %q, want sender@example.com", config.From)
	}
	if config.ResendToken != "resend-token" {
		t.Fatalf("ResendToken = %q, want resend-token", config.ResendToken)
	}
}

func TestNotificationConfigRequiresResendVariables(t *testing.T) {
	t.Setenv("LINKCHECKER_EMAIL_TO", "")
	t.Setenv("LINKCHECKER_EMAIL_FROM", "")
	t.Setenv("LINKCHECKER_RESEND_API_KEY", "")

	_, err := notificationConfig()
	if err == nil || !strings.Contains(err.Error(), "LINKCHECKER_RESEND_API_KEY") {
		t.Fatalf("notificationConfig() error = %v", err)
	}
}

func TestNotificationConfigRejectsInvalidAddresses(t *testing.T) {
	t.Setenv("LINKCHECKER_EMAIL_TO", "not-an-email")
	t.Setenv("LINKCHECKER_EMAIL_FROM", "sender@example.com")
	t.Setenv("LINKCHECKER_RESEND_API_KEY", "resend-token")

	_, err := notificationConfig()
	if err == nil || !strings.Contains(err.Error(), "invalid notification recipient") {
		t.Fatalf("notificationConfig() error = %v", err)
	}
}

func TestBuildLinkCheckerEmailBodies(t *testing.T) {
	links := []linkCheckResult{{
		URL:        "https://example.com/?a=1&b=2",
		StatusCode: 404,
		References: []linkReference{{ArticleID: "article-a", ArticleTitle: "Title <A>", Field: "content"}},
	}}

	htmlBody, textBody := buildLinkCheckerEmailBodies(links)
	for _, want := range []string{"https://example.com/?a=1&amp;b=2", "HTTP 404", "Title &lt;A&gt;"} {
		if !strings.Contains(htmlBody, want) {
			t.Fatalf("HTML body does not contain %q: %s", want, htmlBody)
		}
	}
	for _, want := range []string{"https://example.com/?a=1&b=2", "HTTP 404", "Title <A>"} {
		if !strings.Contains(textBody, want) {
			t.Fatalf("text body does not contain %q: %s", want, textBody)
		}
	}
}

func TestFormatLinkCheckerSender(t *testing.T) {
	tests := []struct {
		name        string
		displayName string
		address     string
		want        string
	}{
		{
			name:        "Japanese display name",
			displayName: "リアル大学生",
			address:     "alerts@example.com",
			want:        "リアル大学生 <alerts@example.com>",
		},
		{
			name:        "empty display name",
			displayName: "  ",
			address:     "alerts@example.com",
			want:        "alerts@example.com",
		},
		{
			name:        "header control characters",
			displayName: "Real\r\n<Blog>",
			address:     "alerts@example.com",
			want:        "Real Blog <alerts@example.com>",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := formatLinkCheckerSender(test.displayName, test.address); got != test.want {
				t.Fatalf("formatLinkCheckerSender() = %q, want %q", got, test.want)
			}
		})
	}
}

func TestLinkCheckerIdempotencyKey(t *testing.T) {
	first := linkCheckerIdempotencyKey("subject", "body")
	second := linkCheckerIdempotencyKey("subject", "body")
	different := linkCheckerIdempotencyKey("subject", "different body")

	if first != second {
		t.Fatalf("same message produced different keys: %q != %q", first, second)
	}
	if first == different {
		t.Fatalf("different messages produced the same key: %q", first)
	}
	if !strings.HasPrefix(first, "linkchecker-") {
		t.Fatalf("key = %q, want linkchecker- prefix", first)
	}
}
