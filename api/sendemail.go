package api

import (
	"net/http"

	"NextBlogApp/internal/contact"
)

func SendEmailHandler(w http.ResponseWriter, r *http.Request) {
	contact.SendEmailHandler(w, r)
}
