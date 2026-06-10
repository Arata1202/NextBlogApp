package recaptcha

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"

	"NextBlogApp/internal/httpx"
	"NextBlogApp/internal/monitoring"
)

func RecaptchaHandler(w http.ResponseWriter, r *http.Request) {
	if !httpx.SetCORSHeaders(w, r, "POST, OPTIONS") {
		return
	}

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		httpx.WriteError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	defer r.Body.Close()

	var req RecaptchaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Failed to parse request: %v", err)
		httpx.WriteError(w, http.StatusBadRequest, "Failed to parse request body")
		return
	}

	if req.RecaptchaResponse == "" {
		httpx.WriteError(w, http.StatusBadRequest, "reCAPTCHA response not found")
		return
	}

	secret := os.Getenv("RECAPTCHA_SECRET_KEY")
	if secret == "" {
		monitoring.CaptureError(errors.New("RECAPTCHA_SECRET_KEY is missing"), monitoring.EventContext{
			Feature:   "recaptcha",
			Operation: "load_recaptcha_secret",
			Request:   r,
		})
		httpx.WriteError(w, http.StatusInternalServerError, "reCAPTCHA secret not set")
		return
	}

	success, err := verifyRecaptchaFunc(req.RecaptchaResponse, secret)
	if err != nil {
		log.Printf("Failed to send reCAPTCHA verification request: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "recaptcha",
			Operation: "verify_recaptcha",
			Request:   r,
		})
		httpx.WriteError(w, http.StatusInternalServerError, "Failed to send reCAPTCHA verification request")
		return
	}

	response := RecaptchaResponse{
		Success: success,
		Message: "reCAPTCHA verification failed",
	}
	if success {
		response.Message = "reCAPTCHA verified successfully"
	}

	httpx.WriteJSON(w, http.StatusOK, response)
}
