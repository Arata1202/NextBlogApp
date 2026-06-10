package httpx

import (
	"encoding/json"
	"log"
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

func SetCORSHeaders(w http.ResponseWriter, r *http.Request, allowMethods string) bool {
	origins := allowedOrigins()
	origin := r.Header.Get("Origin")

	w.Header().Set("Vary", "Origin")
	w.Header().Set("Access-Control-Allow-Methods", allowMethods)
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
		WriteError(w, http.StatusForbidden, "Forbidden")
		return false
	}

	w.Header().Set("Access-Control-Allow-Origin", origin)
	return true
}

func WriteError(w http.ResponseWriter, statusCode int, message string) {
	WriteJSON(w, statusCode, map[string]string{"message": message})
}

func WriteJSON(w http.ResponseWriter, statusCode int, response interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("failed to encode JSON response: %v", err)
	}
}
