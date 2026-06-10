package cron

import (
	"net/http"

	"NextBlogApp/pkg/api/linkchecker"
)

func LinkCheckerHandler(w http.ResponseWriter, r *http.Request) {
	linkchecker.LinkCheckerHandler(w, r)
}
