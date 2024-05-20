package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
)

const apiEndpoint = "https://www.google.com/recaptcha/api/siteverify"

func VerifyRecaptcha(response string) bool {
	secret := os.Getenv("RECAPTCHA_SECRET")
	data := url.Values{}
	data.Set("secret", secret)
	data.Set("response", response)

	resp, err := http.Post(apiEndpoint, "application/x-www-form-urlencoded", strings.NewReader(data.Encode()))
	if err != nil {
		fmt.Println("Error:", err)
		return false
	}
	defer resp.Body.Close()

	var result struct {
		Success bool `json:"success"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		fmt.Println("Error:", err)
		return false
	}

	return result.Success
}

func RecaptchaHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	originURL := os.Getenv("ALLOWED_ORIGIN")
	if originURL != "" && r.Header.Get("Origin") != originURL {
		http.Error(w, "Access Forbidden", http.StatusForbidden)
		return
	}

	recaptchaResponse := r.FormValue("g-recaptcha-response")
	success := VerifyRecaptcha(recaptchaResponse)

	response := map[string]interface{}{
		"success": success,
		"message": func() string {
			if success {
				return "reCAPTCHA verified successfully"
			}
			return "reCAPTCHA verification failed"
		}(),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
