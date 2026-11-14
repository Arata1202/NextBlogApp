package contact

import (
	"strings"
	"testing"
)

func TestMessageBodiesUseDisplayName(t *testing.T) {
	htmlBody, textBody := buildMessageBodies(siteConfig{Title: "Blog", URL: "https://example.com"}, "sender@example.com", "user@example.com", "Title", "Message", "Introduction")
	for _, body := range []string{htmlBody, textBody} {
		if !strings.Contains(body, "運営者: Arata") || strings.Contains(body, "運営者: Arata1202") {
			t.Errorf("message body does not use the expected display name")
		}
	}
}
