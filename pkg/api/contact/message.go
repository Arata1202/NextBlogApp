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

func buildContactMessages(config emailConfig, site siteConfig, request EmailRequestBody) ([]emailMessage, error) {
	from, err := formatNamedHeaderAddress(site.Title, config.From)
	if err != nil {
		return nil, fmt.Errorf("invalid sender address: %w", err)
	}

	owner, err := formatHeaderAddress(config.To)
	if err != nil {
		return nil, fmt.Errorf("invalid owner address: %w", err)
	}

	user, err := formatHeaderAddress(request.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid user address: %w", err)
	}

	title := sanitizeEmailLineContent(request.Title)
	message := sanitizeEmailBodyContent(request.Message)
	userEmail := sanitizeEmailLineContent(request.Email)

	ownerHTML, ownerText := buildMessageBodies(site, from.Address, userEmail, title, message, "お問い合わせを受信しました。")
	confirmationHTML, confirmationText := buildMessageBodies(site, from.Address, userEmail, title, message, "以下の内容でお問い合わせを承りました。")

	return []emailMessage{
		{
			From:    from,
			To:      []mail.Address{owner},
			ReplyTo: user,
			Subject: "【お問い合わせ】" + title,
			HTML:    ownerHTML,
			Text:    ownerText,
		},
		{
			From:    from,
			To:      []mail.Address{user},
			ReplyTo: from,
			Subject: "お問い合わせありがとうございます",
			HTML:    confirmationHTML,
			Text:    confirmationText,
		},
	}, nil
}

func buildMessageBodies(site siteConfig, emailFrom, userEmail, title, message, introduction string) (string, string) {
	escapedUserEmail := html.EscapeString(userEmail)
	escapedTitle := html.EscapeString(title)
	escapedMessage := strings.ReplaceAll(html.EscapeString(message), string('\n'), "<br>")
	escapedSiteTitle := html.EscapeString(site.Title)
	escapedEmailFrom := html.EscapeString(emailFrom)

	var htmlBuilder strings.Builder
	htmlBuilder.WriteString(fmt.Sprintf("<p>%s</p>", html.EscapeString(introduction)))
	htmlBuilder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>メールアドレス: %s</p>", escapedUserEmail))
	htmlBuilder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>件名: %s</p>", escapedTitle))
	htmlBuilder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>内容: %s</p>", escapedMessage))
	htmlBuilder.WriteString("<div style='margin-top: 24px; color: #111827; line-height: 1.7; word-break: break-word;'>")
	htmlBuilder.WriteString("<div style='height: 0; line-height: 0; font-size: 0; border-top: 2px solid #d0d0d0; margin-bottom: 12px;'>&nbsp;</div>")
	htmlBuilder.WriteString(fmt.Sprintf("<span style='color: #111827;'>%s</span><br>", escapedSiteTitle))
	htmlBuilder.WriteString("<span style='color: #111827;'>運営者: Arata1202</span><br>")
	if site.URL != "" {
		escapedWebURL := html.EscapeString(site.URL)
		htmlBuilder.WriteString(fmt.Sprintf("<span style='color: #111827;'>Web: <a href='%s' style='color: #111827; text-decoration: none; word-break: break-all;'>%s</a></span><br>", escapedWebURL, escapedWebURL))
	}
	htmlBuilder.WriteString(fmt.Sprintf("<span style='color: #111827;'>Email: %s</span><br>", escapedEmailFrom))
	htmlBuilder.WriteString("<div style='height: 0; line-height: 0; font-size: 0; border-top: 2px solid #d0d0d0; margin-top: 12px;'>&nbsp;</div>")
	htmlBuilder.WriteString("</div>")

	var textBuilder strings.Builder
	textBuilder.WriteString(introduction)
	textBuilder.WriteString(`

メールアドレス: `)
	textBuilder.WriteString(userEmail)
	textBuilder.WriteString(`
件名: `)
	textBuilder.WriteString(title)
	textBuilder.WriteString(`
内容:
`)
	textBuilder.WriteString(message)
	textBuilder.WriteString(`

---
`)
	textBuilder.WriteString(site.Title)
	textBuilder.WriteString(`
運営者: Arata1202`)
	if site.URL != "" {
		textBuilder.WriteString(`
Web: `)
		textBuilder.WriteString(site.URL)
	}
	textBuilder.WriteString(`
Email: `)
	textBuilder.WriteString(emailFrom)

	return htmlBuilder.String(), textBuilder.String()
}
