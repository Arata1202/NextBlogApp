package linkchecker

import (
	"crypto/tls"
	"errors"
	"fmt"
	"html"
	"mime"
	"net"
	"net/mail"
	"net/smtp"
	"os"
	"strings"
	"time"
)

func sendLinkCheckerSMTPMail(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
	host, _, err := net.SplitHostPort(addr)
	if err != nil {
		return err
	}

	dialer := net.Dialer{Timeout: linkCheckerSMTPTimeout}
	conn, err := dialer.Dial("tcp", addr)
	if err != nil {
		return err
	}
	defer conn.Close()

	if err := conn.SetDeadline(time.Now().Add(linkCheckerSMTPTimeout)); err != nil {
		return err
	}

	client, err := smtp.NewClient(conn, host)
	if err != nil {
		return err
	}
	defer client.Close()

	if ok, _ := client.Extension("STARTTLS"); ok {
		if err := client.StartTLS(&tls.Config{ServerName: host, MinVersion: tls.VersionTLS12}); err != nil {
			return err
		}
	}

	if auth != nil {
		if ok, _ := client.Extension("AUTH"); !ok {
			return errors.New("smtp: server doesn't support AUTH")
		}
		if err := client.Auth(auth); err != nil {
			return err
		}
	}

	if err := client.Mail(from); err != nil {
		return err
	}

	for _, recipient := range to {
		if err := client.Rcpt(recipient); err != nil {
			return err
		}
	}

	writer, err := client.Data()
	if err != nil {
		return err
	}

	if _, err := writer.Write(msg); err != nil {
		_ = writer.Close()
		return err
	}

	if err := writer.Close(); err != nil {
		return err
	}

	return client.Quit()
}

func notificationConfig() (string, string, string, string, error) {
	to := strings.TrimSpace(os.Getenv("EMAIL_TO"))
	from := strings.TrimSpace(os.Getenv("EMAIL_FROM"))
	smtpUser := strings.TrimSpace(os.Getenv("SMTP_USER"))
	smtpPass := strings.TrimSpace(os.Getenv("SMTP_PASS"))

	if to == "" || from == "" || smtpUser == "" || smtpPass == "" {
		return "", "", "", "", fmt.Errorf("EMAIL_TO, EMAIL_FROM, SMTP_USER, and SMTP_PASS environment variables are required")
	}

	toAddress, err := mail.ParseAddress(to)
	if err != nil {
		return "", "", "", "", fmt.Errorf("invalid notification recipient: %w", err)
	}

	fromAddress, err := mail.ParseAddress(from)
	if err != nil {
		return "", "", "", "", fmt.Errorf("invalid notification sender: %w", err)
	}

	return toAddress.Address, fromAddress.Address, smtpUser, smtpPass, nil
}

func linkCheckerIssueLabel(link linkCheckResult) string {
	if link.Error != "" {
		return link.Error
	}

	return fmt.Sprintf("HTTP %d", link.StatusCode)
}

func writeLinkCheckerEmailBody(builder *strings.Builder, links []linkCheckResult) {
	builder.WriteString("<p>記事コンテンツ内でリンク切れの可能性があるURLを検出しました。</p>")
	builder.WriteString("<ul>")

	for index, link := range links {
		if index >= linkCheckerEmailPreviewLimit {
			builder.WriteString(fmt.Sprintf("<li>ほか %d 件</li>", len(links)-linkCheckerEmailPreviewLimit))
			break
		}

		escapedURL := html.EscapeString(link.URL)
		builder.WriteString("<li style=\"margin-bottom:16px;\">")
		builder.WriteString(fmt.Sprintf("<a href=\"%s\">%s</a><br>", escapedURL, escapedURL))
		builder.WriteString(fmt.Sprintf("状態: %s<br>", html.EscapeString(linkCheckerIssueLabel(link))))
		builder.WriteString("参照元:<ul>")
		for _, ref := range link.References {
			label := fmt.Sprintf("%s %s", ref.ArticleID, ref.Field)
			if ref.ArticleTitle != "" {
				label = fmt.Sprintf("%s (%s) %s", ref.ArticleID, ref.ArticleTitle, ref.Field)
			}
			builder.WriteString(fmt.Sprintf("<li>%s</li>", html.EscapeString(strings.TrimSpace(label))))
		}
		builder.WriteString("</ul></li>")
	}

	builder.WriteString("</ul>")
}

func sendLinkCheckerNotification(links []linkCheckResult) error {
	to, from, smtpUser, smtpPass, err := notificationConfig()
	if err != nil {
		return err
	}

	siteTitle := strings.TrimSpace(os.Getenv("BASE_TITLE"))
	subject := "リンク切れを検出しました"
	if siteTitle != "" {
		subject = siteTitle + " - " + subject
	}

	fromAddress := mail.Address{Name: siteTitle, Address: from}
	toAddress := mail.Address{Address: to}

	var builder strings.Builder
	builder.WriteString(fmt.Sprintf("From: %s\r\n", fromAddress.String()))
	builder.WriteString(fmt.Sprintf("To: %s\r\n", toAddress.String()))
	builder.WriteString(fmt.Sprintf("Subject: %s\r\n", mime.QEncoding.Encode("UTF-8", subject)))
	builder.WriteString("MIME-Version: 1.0\r\n")
	builder.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
	builder.WriteString("\r\n")
	writeLinkCheckerEmailBody(&builder, links)

	auth := smtp.PlainAuth("", smtpUser, smtpPass, "smtp.gmail.com")
	return linkCheckerSMTPSend("smtp.gmail.com:587", auth, from, []string{to}, []byte(builder.String()))
}
