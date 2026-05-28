package api

import (
	"net/http"
	"os"
	"strings"
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

func setCORSHeaders(w http.ResponseWriter, r *http.Request) bool {
	origins := allowedOrigins()
	origin := r.Header.Get("Origin")

	w.Header().Set("Vary", "Origin")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
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
