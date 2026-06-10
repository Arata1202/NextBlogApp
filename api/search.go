package api

import (
	"net/http"

	"NextBlogApp/pkg/api/search"
)

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	search.SearchHandler(w, r)
}
