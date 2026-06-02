package api

import (
	"encoding/json"
	"fmt"
	"html"
	"log"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"strings"
	"unicode"
	"unicode/utf8"
)

type EmailRequestBody struct {
	Title             string `json:"title"`
	Email             string `json:"email"`
	Message           string `json:"message"`
	RecaptchaResponse string `json:"g-recaptcha-response"`
}

var (
	sendEmailFunc = sendEmail
	smtpSendMail  = smtp.SendMail
)

const (
	maxEmailLength   = 254
	maxTitleLength   = 200
	maxMessageLength = 5000
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

func sanitizeEmailContent(value string, keepLineBreaks bool) string {
	lineBreakReplacement := " "
	if keepLineBreaks {
		lineBreakReplacement = "\n"
	}

	normalizedValue := strings.ReplaceAll(value, "\r\n", lineBreakReplacement)
	normalizedValue = strings.ReplaceAll(normalizedValue, "\r", lineBreakReplacement)
	normalizedValue = strings.ReplaceAll(normalizedValue, "\n", lineBreakReplacement)

	return strings.Map(func(r rune) rune {
		if unicode.IsControl(r) && r != '\t' && !(keepLineBreaks && r == '\n') {
			return -1
		}

		return r
	}, normalizedValue)
}

func sanitizeEmailLineContent(value string) string {
	return sanitizeEmailContent(value, false)
}

func sanitizeEmailBodyContent(value string) string {
	return sanitizeEmailContent(value, true)
}

func sanitizeEmailPayload(value string) string {
	return strings.ReplaceAll(sanitizeEmailBodyContent(value), "\n", "\r\n")
}

func containsDisallowedEmailContentCharacters(value string, allowLineBreaks bool) bool {
	if !utf8.ValidString(value) {
		return true
	}

	for _, r := range value {
		if unicode.IsPrint(r) || r == '\t' || (allowLineBreaks && r == '\n') {
			continue
		}

		return true
	}

	return false
}

func validateEmailTextField(name, value string, maxLength int, allowLineBreaks bool) error {
	if utf8.RuneCountInString(value) > maxLength {
		return fmt.Errorf("%s is too long", name)
	}
	if containsDisallowedEmailContentCharacters(value, allowLineBreaks) {
		return fmt.Errorf("%s contains disallowed characters", name)
	}

	return nil
}

func validateEmailRequestInput(req *EmailRequestBody) error {
	req.Email = strings.TrimSpace(req.Email)
	if len(req.Email) > maxEmailLength {
		return fmt.Errorf("email is too long")
	}
	if containsDisallowedEmailContentCharacters(req.Email, false) {
		return fmt.Errorf("email contains disallowed characters")
	}
	parsedAddress, err := mail.ParseAddress(req.Email)
	if err != nil {
		return fmt.Errorf("invalid email address: %w", err)
	}
	if parsedAddress.Address != req.Email {
		return fmt.Errorf("email must be an addr-spec")
	}

	if err := validateEmailTextField("title", req.Title, maxTitleLength, false); err != nil {
		return err
	}
	if err := validateEmailTextField("message", req.Message, maxMessageLength, true); err != nil {
		return err
	}

	return nil
}

func sendEmail(emailTo, emailFrom, smtpUser, smtpPass, userEmail, title, message string) error {
	baseTitle := os.Getenv("BASE_TITLE")
	webUrl := os.Getenv("NEXT_PUBLIC_BASE_URL")
	if webUrl == "" {
		webUrl = os.Getenv("ORIGIN_URL")
	}

	from, err := formatNamedHeaderAddress(baseTitle, emailFrom)
	if err != nil {
		return fmt.Errorf("invalid sender address: %w", err)
	}

	ownerAddress, err := formatHeaderAddress(emailTo)
	if err != nil {
		return fmt.Errorf("invalid owner address: %w", err)
	}

	userAddress, err := formatHeaderAddress(userEmail)
	if err != nil {
		return fmt.Errorf("invalid user address: %w", err)
	}

	toHeader := strings.Join([]string{ownerAddress.String(), userAddress.String()}, ", ")
	recipients := []string{ownerAddress.Address, userAddress.Address}

	sanitizedUserEmail := sanitizeEmailLineContent(userEmail)
	sanitizedTitle := sanitizeEmailLineContent(title)
	sanitizedMessage := sanitizeEmailBodyContent(message)

	var builder strings.Builder
	builder.WriteString(fmt.Sprintf("From: %s\r\n", from.String()))
	builder.WriteString(fmt.Sprintf("To: %s\r\n", toHeader))
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
	builder.WriteString(fmt.Sprintf("<span style='color: #111827;'>%s</span><br>", html.EscapeString(baseTitle)))
	builder.WriteString("<span style='color: #111827;'>運営者: Arata1202</span><br>")
	if webUrl != "" {
		escapedWebUrl := html.EscapeString(webUrl)
		builder.WriteString(fmt.Sprintf("<span style='color: #111827;'>Web: <a href='%s' style='color: #111827; text-decoration: none; word-break: break-all;'>%s</a></span><br>", escapedWebUrl, escapedWebUrl))
	}
	builder.WriteString(fmt.Sprintf("<span style='color: #111827;'>Email: %s</span><br>", html.EscapeString(emailFrom)))
	builder.WriteString("<div style='height: 0; line-height: 0; font-size: 0; border-top: 2px solid #d0d0d0; margin-top: 12px;'>&nbsp;</div>")
	builder.WriteString("</div>")

	msg := sanitizeEmailPayload(builder.String())

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)

	return smtpSendMail(smtpHost+":"+smtpPort, auth, from.Address, recipients, []byte(msg))
}

func SendEmailHandler(w http.ResponseWriter, r *http.Request) {
	if !setCORSHeaders(w, r, "POST, OPTIONS") {
		return
	}
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"status": "Method Not Allowed"})
		return
	}

	defer r.Body.Close()

	var req EmailRequestBody
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Failed to parse request body: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "Invalid request body"})
		return
	}

	if req.Email == "" || req.Title == "" || req.Message == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "Missing required fields"})
		return
	}

	if err := validateEmailRequestInput(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "Invalid request fields"})
		return
	}

	if req.RecaptchaResponse == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "Missing reCAPTCHA response"})
		return
	}

	recaptchaSecret := os.Getenv("RECAPTCHA_SECRET_KEY")
	if recaptchaSecret == "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "reCAPTCHA secret missing"})
		return
	}

	verified, err := verifyRecaptchaFunc(req.RecaptchaResponse, recaptchaSecret)
	if err != nil {
		log.Printf("Failed to verify reCAPTCHA: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "reCAPTCHA verification failed"})
		return
	}

	if !verified {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"status": "reCAPTCHA verification failed"})
		return
	}

	emailTo := os.Getenv("EMAIL_TO")
	emailFrom := os.Getenv("EMAIL_FROM")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")

	if emailTo == "" || emailFrom == "" || smtpUser == "" || smtpPass == "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "Environment variables missing"})
		return
	}

	if err := sendEmailFunc(emailTo, emailFrom, smtpUser, smtpPass, req.Email, req.Title, req.Message); err != nil {
		log.Printf("Failed to send email: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "fail"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
