package contact

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"NextBlogApp/pkg/api/httpx"
	"NextBlogApp/pkg/api/monitoring"
	"NextBlogApp/pkg/api/turnstile"
)

const (
	contactTurnstileAction     = "contact"
	maxContactRequestBodyBytes = 32 << 10
)

var (
	verifyTurnstileFunc = turnstile.Verify
	newEmailSenderFunc  = newResendEmailSender
)

func writeEmailStatus(w http.ResponseWriter, statusCode int, status string) {
	httpx.WriteJSON(w, statusCode, statusResponse{Status: status})
}

func writeRequestBodyError(w http.ResponseWriter, err error) {
	var maxBytesError *http.MaxBytesError
	if errors.As(err, &maxBytesError) {
		writeEmailStatus(w, http.StatusRequestEntityTooLarge, "Request body too large")
		return
	}

	log.Printf("Failed to parse request body: %v", err)
	writeEmailStatus(w, http.StatusBadRequest, "Invalid request body")
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
	r.Body = http.MaxBytesReader(w, r.Body, maxContactRequestBodyBytes)

	decoder := json.NewDecoder(r.Body)
	var req EmailRequestBody
	if err := decoder.Decode(&req); err != nil {
		writeRequestBodyError(w, err)
		return
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		writeRequestBodyError(w, err)
		return
	}

	if req.RequestID == "" || req.Email == "" || req.Title == "" || req.Message == "" {
		writeEmailStatus(w, http.StatusBadRequest, "Missing required fields")
		return
	}

	if req.TurnstileToken == "" || req.TurnstileValidationID == "" {
		writeEmailStatus(w, http.StatusBadRequest, "Missing Turnstile validation")
		return
	}

	if err := validateEmailRequestInput(&req); err != nil {
		writeEmailStatus(w, http.StatusBadRequest, "Invalid request fields")
		return
	}

	turnstileSecret := strings.TrimSpace(os.Getenv("TURNSTILE_SECRET_KEY"))
	expectedHostname := strings.TrimSpace(os.Getenv("TURNSTILE_EXPECTED_HOSTNAME"))
	if turnstileSecret == "" || expectedHostname == "" {
		monitoring.CaptureError(errors.New("TURNSTILE_SECRET_KEY or TURNSTILE_EXPECTED_HOSTNAME is missing"), monitoring.EventContext{
			Feature:   "sendemail",
			Operation: "load_turnstile_config",
			Request:   r,
		})
		writeEmailStatus(w, http.StatusInternalServerError, "Turnstile configuration missing")
		return
	}

	verified, err := verifyTurnstileFunc(
		r.Context(),
		req.TurnstileToken,
		turnstileSecret,
		expectedHostname,
		contactTurnstileAction,
		req.TurnstileValidationID,
	)
	if err != nil {
		log.Printf("Failed to verify Turnstile token: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "sendemail",
			Operation: "verify_turnstile",
			Request:   r,
		})
		writeEmailStatus(w, http.StatusInternalServerError, "Turnstile verification failed")
		return
	}

	if !verified {
		writeEmailStatus(w, http.StatusForbidden, "Turnstile verification failed")
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

	sender := newEmailSenderFunc(emailConfig.ResendToken)
	if _, err := sendContactEmails(r.Context(), sender, emailConfig, loadSiteConfigFromEnv(), req); err != nil {
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
