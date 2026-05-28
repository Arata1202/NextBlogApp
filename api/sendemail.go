package api

import (
	"encoding/json"
	"fmt"
	"html"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"strings"
)

type EmailRequestBody struct {
	Title   string `json:"title"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

var (
	sendEmailFunc = sendEmail
	smtpSendMail  = smtp.SendMail
)

func sendEmail(emailTo, emailFrom, smtpUser, smtpPass, userEmail, title, message string) error {
	baseTitle := os.Getenv("BASE_TITLE")
	webUrl := os.Getenv("NEXT_PUBLIC_BASE_URL")
	if webUrl == "" {
		webUrl = os.Getenv("ORIGIN_URL")
	}
	from := fmt.Sprintf("\"%s\" <%s>", baseTitle, emailFrom)

	var builder strings.Builder
	builder.WriteString(fmt.Sprintf("From: %s\r\n", from))
	builder.WriteString(fmt.Sprintf("To: %s,%s\r\n", emailTo, userEmail))
	builder.WriteString("Subject: お問い合わせありがとうございます\r\n")
	builder.WriteString("MIME-Version: 1.0\r\n")
	builder.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
	builder.WriteString("\r\n")
	builder.WriteString("<p>以下の内容でお問い合わせを承りました。</p>")
	builder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>メールアドレス: %s</p>", html.EscapeString(userEmail)))
	builder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>件名: %s</p>", html.EscapeString(title)))
	builder.WriteString(fmt.Sprintf("<p style='padding: 12px; border-left: 4px solid #d0d0d0;'>内容: %s</p>", strings.ReplaceAll(html.EscapeString(message), "\n", "<br>")))
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

	msg := builder.String()

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)

	return smtpSendMail(smtpHost+":"+smtpPort, auth, emailFrom, []string{emailTo, userEmail}, []byte(msg))
}

func SendEmailHandler(w http.ResponseWriter, r *http.Request) {
	originUrl := os.Getenv("ORIGIN_URL")
	w.Header().Set("Access-Control-Allow-Origin", originUrl)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

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
		json.NewEncoder(w).Encode(map[string]string{"status": "fail", "error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"success": "success"})
}
