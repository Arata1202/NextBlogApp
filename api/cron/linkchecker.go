package cron

import (
	"net/http"

	"NextBlogApp/internal/linkchecker"
)

func LinkCheckerHandler(w http.ResponseWriter, r *http.Request) {
	linkchecker.LinkCheckerHandler(w, r)
}
