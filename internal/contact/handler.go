package contact

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"NextBlogApp/internal/httpx"
	"NextBlogApp/internal/monitoring"
	"NextBlogApp/internal/recaptcha"
)

var (
	sendEmailFunc       = sendEmail
	verifyRecaptchaFunc = recaptcha.Verify
)

func writeEmailStatus(w http.ResponseWriter, statusCode int, status string) {
	httpx.WriteJSON(w, statusCode, statusResponse{Status: status})
}

func SendEmailHandler(w http.ResponseWriter, r *http.Request) {
	if !httpx.SetCORSHeaders(w, r, "POST, OPTIONS") {
		return
	}
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		writeEmailStatus(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	defer r.Body.Close()

	var req EmailRequestBody
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Failed to parse request body: %v", err)
		writeEmailStatus(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Email == "" || req.Title == "" || req.Message == "" {
		writeEmailStatus(w, http.StatusBadRequest, "Missing required fields")
		return
	}

	if err := validateEmailRequestInput(&req); err != nil {
		writeEmailStatus(w, http.StatusBadRequest, "Invalid request fields")
		return
	}

	if req.RecaptchaResponse == "" {
		writeEmailStatus(w, http.StatusBadRequest, "Missing reCAPTCHA response")
		return
	}

	recaptchaSecret := os.Getenv("RECAPTCHA_SECRET_KEY")
	if recaptchaSecret == "" {
		monitoring.CaptureError(errors.New("RECAPTCHA_SECRET_KEY is missing"), monitoring.EventContext{
			Feature:   "sendemail",
			Operation: "load_recaptcha_secret",
			Request:   r,
		})
		writeEmailStatus(w, http.StatusInternalServerError, "reCAPTCHA secret missing")
		return
	}

	verified, err := verifyRecaptchaFunc(req.RecaptchaResponse, recaptchaSecret)
	if err != nil {
		log.Printf("Failed to verify reCAPTCHA: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "sendemail",
			Operation: "verify_recaptcha",
			Request:   r,
		})
		writeEmailStatus(w, http.StatusInternalServerError, "reCAPTCHA verification failed")
		return
	}

	if !verified {
		writeEmailStatus(w, http.StatusForbidden, "reCAPTCHA verification failed")
		return
	}

	emailConfig, err := loadEmailConfigFromEnv()
	if err != nil {
		monitoring.CaptureError(fmt.Errorf("email environment variables missing: %w", err), monitoring.EventContext{
			Feature:   "sendemail",
			Operation: "load_email_env",
			Request:   r,
		})
		writeEmailStatus(w, http.StatusInternalServerError, "Environment variables missing")
		return
	}

	if err := sendEmailFunc(emailConfig.To, emailConfig.From, emailConfig.SMTPUser, emailConfig.SMTPPass, req.Email, req.Title, req.Message); err != nil {
		log.Printf("Failed to send email: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "sendemail",
			Operation: "send_email",
			Request:   r,
		})
		writeEmailStatus(w, http.StatusInternalServerError, "fail")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, successResponse{Success: true})
}
