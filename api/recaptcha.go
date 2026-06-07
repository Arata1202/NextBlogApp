package api

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"NextBlogApp/pkg/monitoring"
)

type RecaptchaRequest struct {
	RecaptchaResponse string `json:"g-recaptcha-response"`
}

type RecaptchaResponse struct {
	Success bool `json:"success"`
}

var (
	recaptchaVerificationURL = "https://www.google.com/recaptcha/api/siteverify"
	recaptchaHTTPClient      = &http.Client{Timeout: 10 * time.Second}
	verifyRecaptchaFunc      = verifyRecaptcha
)

func allowedOrigins() map[string]struct{} {
	origins := map[string]struct{}{}

	for _, origin := range strings.Split(os.Getenv("ORIGIN_URL"), ",") {
		origin = strings.TrimSpace(origin)
		if origin != "" {
			origins[origin] = struct{}{}
		}
	}

	return origins
}

func setCORSHeaders(w http.ResponseWriter, r *http.Request, allowMethods string) bool {
	origins := allowedOrigins()
	origin := r.Header.Get("Origin")

	w.Header().Set("Vary", "Origin")
	w.Header().Set("Access-Control-Allow-Methods", allowMethods)
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if origin == "" {
		if len(origins) == 1 {
			for allowedOrigin := range origins {
				w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
			}
		}
		return true
	}

	if _, ok := origins[origin]; !ok {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return false
	}

	w.Header().Set("Access-Control-Allow-Origin", origin)
	return true
}

func verifyRecaptcha(response, secret string) (bool, error) {
	data := url.Values{}
	data.Set("secret", secret)
	data.Set("response", response)

	resp, err := recaptchaHTTPClient.PostForm(recaptchaVerificationURL, data)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	var result RecaptchaResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}
	return result.Success, nil
}

func RecaptchaHandler(w http.ResponseWriter, r *http.Request) {
	if !setCORSHeaders(w, r, "POST, OPTIONS") {
		return
	}

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	defer r.Body.Close()

	var req RecaptchaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Failed to parse request: %v", err)
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	if req.RecaptchaResponse == "" {
		http.Error(w, "reCAPTCHA response not found", http.StatusBadRequest)
		return
	}

	secret := os.Getenv("RECAPTCHA_SECRET_KEY")
	if secret == "" {
		monitoring.CaptureError(errors.New("RECAPTCHA_SECRET_KEY is missing"), monitoring.EventContext{
			Feature:   "recaptcha",
			Operation: "load_recaptcha_secret",
			Request:   r,
		})
		http.Error(w, "reCAPTCHA secret not set", http.StatusInternalServerError)
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
		http.Error(w, "Failed to send reCAPTCHA verification request", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": success,
	}
	if success {
		response["message"] = "reCAPTCHA verified successfully"
	} else {
		response["message"] = "reCAPTCHA verification failed"
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}
