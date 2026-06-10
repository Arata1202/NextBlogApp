package api

import (
	"net/http"

	"NextBlogApp/internal/recaptcha"
)

func RecaptchaHandler(w http.ResponseWriter, r *http.Request) {
	recaptcha.RecaptchaHandler(w, r)
}
