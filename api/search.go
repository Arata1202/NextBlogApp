package api

import (
	"net/http"

	"NextBlogApp/internal/search"
)

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	search.SearchHandler(w, r)
}
