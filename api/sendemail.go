package api

import (
	"net/http"

	"NextBlogApp/pkg/api/contact"
)

func SendEmailHandler(w http.ResponseWriter, r *http.Request) {
	contact.SendEmailHandler(w, r)
}
