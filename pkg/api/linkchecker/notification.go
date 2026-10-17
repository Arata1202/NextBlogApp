package linkchecker

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"html"
	"net/mail"
	"os"
	"strings"

	"github.com/resend/resend-go/v4"
)

type linkCheckerNotificationConfig struct {
	To          string
	From        string
	ResendToken string
}

func notificationConfig() (linkCheckerNotificationConfig, error) {
	config := linkCheckerNotificationConfig{
		To:          strings.TrimSpace(os.Getenv("LINKCHECKER_EMAIL_TO")),
		From:        strings.TrimSpace(os.Getenv("LINKCHECKER_EMAIL_FROM")),
		ResendToken: strings.TrimSpace(os.Getenv("LINKCHECKER_RESEND_API_KEY")),
	}

	if config.To == "" || config.From == "" || config.ResendToken == "" {
		return linkCheckerNotificationConfig{}, fmt.Errorf("LINKCHECKER_EMAIL_TO, LINKCHECKER_EMAIL_FROM, and LINKCHECKER_RESEND_API_KEY environment variables are required")
	}

	toAddress, err := mail.ParseAddress(config.To)
	if err != nil {
		return linkCheckerNotificationConfig{}, fmt.Errorf("invalid notification recipient: %w", err)
	}

	fromAddress, err := mail.ParseAddress(config.From)
	if err != nil {
		return linkCheckerNotificationConfig{}, fmt.Errorf("invalid notification sender: %w", err)
	}

	config.To = toAddress.Address
	config.From = fromAddress.Address
	return config, nil
}

func sendLinkCheckerResendEmail(ctx context.Context, token string, params *resend.SendEmailRequest, options *resend.SendEmailOptions) (string, error) {
	client := resend.NewClient(token)
	response, err := client.Emails.SendWithOptions(ctx, params, options)
	if err != nil {
		return "", fmt.Errorf("send link checker email with Resend: %w", err)
	}
	if response == nil || strings.TrimSpace(response.Id) == "" {
		return "", fmt.Errorf("send link checker email with Resend: response did not include an email ID")
	}

	return response.Id, nil
}

func linkCheckerIssueLabel(link linkCheckResult) string {
	if link.Error != "" {
		return link.Error
	}

	return fmt.Sprintf("HTTP %d", link.StatusCode)
}

func buildLinkCheckerEmailBodies(links []linkCheckResult) (string, string) {
	var htmlBuilder strings.Builder
	var textBuilder strings.Builder

	htmlBuilder.WriteString("<p>記事コンテンツ内でリンク切れの可能性があるURLを検出しました。</p>")
	htmlBuilder.WriteString("<ul>")
	textBuilder.WriteString("記事コンテンツ内でリンク切れの可能性があるURLを検出しました。\n\n")

	for index, link := range links {
		if index >= linkCheckerEmailPreviewLimit {
			remaining := len(links) - linkCheckerEmailPreviewLimit
			htmlBuilder.WriteString(fmt.Sprintf("<li>ほか %d 件</li>", remaining))
			textBuilder.WriteString(fmt.Sprintf("ほか %d 件\n", remaining))
			break
		}

		escapedURL := html.EscapeString(link.URL)
		issueLabel := linkCheckerIssueLabel(link)
		htmlBuilder.WriteString("<li style=\"margin-bottom:16px;\">")
		htmlBuilder.WriteString(fmt.Sprintf("<a href=\"%s\">%s</a><br>", escapedURL, escapedURL))
		htmlBuilder.WriteString(fmt.Sprintf("状態: %s<br>", html.EscapeString(issueLabel)))
		htmlBuilder.WriteString("参照元:<ul>")

		textBuilder.WriteString(fmt.Sprintf("- %s\n  状態: %s\n  参照元:\n", link.URL, issueLabel))
		for _, ref := range link.References {
			label := fmt.Sprintf("%s %s", ref.ArticleID, ref.Field)
			if ref.ArticleTitle != "" {
				label = fmt.Sprintf("%s (%s) %s", ref.ArticleID, ref.ArticleTitle, ref.Field)
			}
			label = strings.TrimSpace(label)
			htmlBuilder.WriteString(fmt.Sprintf("<li>%s</li>", html.EscapeString(label)))
			textBuilder.WriteString(fmt.Sprintf("    - %s\n", label))
		}
		htmlBuilder.WriteString("</ul></li>")
		textBuilder.WriteString("\n")
	}

	htmlBuilder.WriteString("</ul>")
	return htmlBuilder.String(), strings.TrimSpace(textBuilder.String())
}

func linkCheckerIdempotencyKey(subject, htmlBody string) string {
	sum := sha256.Sum256([]byte(subject + "\n" + htmlBody))
	return "linkchecker-" + hex.EncodeToString(sum[:])
}

func sendLinkCheckerNotification(ctx context.Context, links []linkCheckResult) error {
	config, err := notificationConfig()
	if err != nil {
		return err
	}

	siteTitle := strings.TrimSpace(os.Getenv("BASE_TITLE"))
	subject := "リンク切れを検出しました"
	from := config.From
	if siteTitle != "" {
		subject = siteTitle + " - " + subject
		from = (&mail.Address{Name: siteTitle, Address: config.From}).String()
	}

	htmlBody, textBody := buildLinkCheckerEmailBodies(links)
	params := &resend.SendEmailRequest{
		From:    from,
		To:      []string{config.To},
		Subject: subject,
		Html:    htmlBody,
		Text:    textBody,
	}
	options := &resend.SendEmailOptions{IdempotencyKey: linkCheckerIdempotencyKey(subject, htmlBody)}

	notificationContext, cancel := context.WithTimeout(ctx, linkCheckerNotificationTimeout)
	defer cancel()

	_, err = linkCheckerResendSend(notificationContext, config.ResendToken, params, options)
	return err
}
