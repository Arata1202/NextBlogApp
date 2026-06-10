package contact

import (
	"fmt"
	"html"
	"net/mail"
	"strings"
)

func formatHeaderAddress(address string) (mail.Address, error) {
	parsedAddress, err := mail.ParseAddress(strings.TrimSpace(address))
	if err != nil {
		return mail.Address{}, err
	}

	return mail.Address{Address: parsedAddress.Address}, nil
}

func formatNamedHeaderAddress(name, address string) (mail.Address, error) {
	parsedAddress, err := formatHeaderAddress(address)
	if err != nil {
		return mail.Address{}, err
	}

	parsedAddress.Name = strings.Join(strings.Fields(name), " ")
	return parsedAddress, nil
}

func buildEmailMessage(site siteConfig, emailFrom, userEmail, title, message string, recipients []mail.Address) string {
	sanitizedUserEmail := sanitizeEmailLineContent(userEmail)
	sanitizedTitle := sanitizeEmailLineContent(title)
	sanitizedMessage := sanitizeEmailBodyContent(message)

	toHeaderValues := make([]string, 0, len(recipients))
	for _, recipient := range recipients {
		toHeaderValues = append(toHeaderValues, recipient.String())
	}

	from := mail.Address{Name: site.Title, Address: emailFrom}

	var builder strings.Builder
	builder.WriteString(fmt.Sprintf("From: %s\r\n", from.String()))
	builder.WriteString(fmt.Sprintf("To: %s\r\n", strings.Join(toHeaderValues, ", ")))
	builder.WriteString("Subject: お問い合わせありがとうございます\r\n")
	builder.WriteString("MIME-Version: 1.0\r\n")
	builder.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
	builder.WriteString("\r\n")
	builder.WriteString("<p>以下の内容でお問い合わせを承りました。</p>")
	builder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>メールアドレス: %s</p>", html.EscapeString(sanitizedUserEmail)))
	builder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>件名: %s</p>", html.EscapeString(sanitizedTitle)))
	builder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>内容: %s</p>", strings.ReplaceAll(html.EscapeString(sanitizedMessage), "\n", "<br>")))
	builder.WriteString("<div style='margin-top: 24px; color: #111827; line-height: 1.7; word-break: break-word;'>")
	builder.WriteString("<div style='height: 0; line-height: 0; font-size: 0; border-top: 2px solid #d0d0d0; margin-bottom: 12px;'>&nbsp;</div>")
	builder.WriteString(fmt.Sprintf("<span style='color: #111827;'>%s</span><br>", html.EscapeString(site.Title)))
	builder.WriteString("<span style='color: #111827;'>運営者: Arata1202</span><br>")
	if site.URL != "" {
		escapedWebURL := html.EscapeString(site.URL)
		builder.WriteString(fmt.Sprintf("<span style='color: #111827;'>Web: <a href='%s' style='color: #111827; text-decoration: none; word-break: break-all;'>%s</a></span><br>", escapedWebURL, escapedWebURL))
	}
	builder.WriteString(fmt.Sprintf("<span style='color: #111827;'>Email: %s</span><br>", html.EscapeString(emailFrom)))
	builder.WriteString("<div style='height: 0; line-height: 0; font-size: 0; border-top: 2px solid #d0d0d0; margin-top: 12px;'>&nbsp;</div>")
	builder.WriteString("</div>")

	return builder.String()
}
