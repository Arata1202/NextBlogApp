package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"strings"
)

type EmailRequest struct {
    Sei     string `json:"sei"`
    Mei     string `json:"mei"`
    Email   string `json:"email"`
    Message string `json:"message"`
}

func sendMail(to, subject, body string) error {
    from := os.Getenv("GMAIL_ADDRESS")
    password := os.Getenv("GMAIL_APP_PASSWORD")
    smtpHost := "smtp.gmail.com"
    smtpPort := "587"

    auth := smtp.PlainAuth("", from, password, smtpHost)

    msg := "From: " + from + "\n" +
        "To: " + to + "\n" +
        "Subject: " + subject + "\n" +
        "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n" +
        body

    err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, strings.Split(to, ","), []byte(msg))
    if err != nil {
        log.Printf("smtp.SendMail error: %v", err)
    }
    return err
}

func EmailHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != "POST" {
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        return
    }

    var request EmailRequest
    err := json.NewDecoder(r.Body).Decode(&request)
    if err != nil {
        log.Printf("json.NewDecoder error: %v", err)
        http.Error(w, "Bad Request", http.StatusBadRequest)
        return
    }

    to := request.Email + "," + os.Getenv("EMAIL_TO")
    subject := "お問い合わせありがとうございます"

    message := fmt.Sprintf(`
        <p>以下の内容でお問い合わせを承りました。</p>
        <p>数日以内にご連絡いたしますので、しばらくお待ちください。</p>
        <p style='padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;'>氏名: %s</p>
        <p style='padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;'>題名: %s</p>
        <p style='padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;'>メールアドレス: %s</p>
        <p style='padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;'>お問い合わせ内容: %s</p>
    `, request.Sei, request.Mei, request.Email, request.Message)

    err = sendMail(to, subject, message)
    if err != nil {
        log.Printf("sendMail error: %v", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
