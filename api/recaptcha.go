package api

import (
	"net/http"

	"NextBlogApp/pkg/api/recaptcha"
)

func RecaptchaHandler(w http.ResponseWriter, r *http.Request) {
	recaptcha.RecaptchaHandler(w, r)
}
