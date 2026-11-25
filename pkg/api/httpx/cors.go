package httpx

import (
	"encoding/json"
	"errors"
	"io"
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

	w.Header().Add("Vary", "Origin")
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
	body, err := json.Marshal(response)
	if err != nil {
		log.Printf("failed to encode JSON response: %v", err)
		body = []byte(`{"message":"Internal Server Error"}`)
		statusCode = http.StatusInternalServerError
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_, _ = w.Write(append(body, '\n'))
}

func ReadRequestJSON(w http.ResponseWriter, r *http.Request, target any) (int, error) {
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 128<<10))
	if err != nil {
		var limit *http.MaxBytesError
		if errors.As(err, &limit) {
			return http.StatusRequestEntityTooLarge, err
		}
		return http.StatusBadRequest, err
	}
	if err := json.Unmarshal(body, target); err != nil {
		return http.StatusBadRequest, err
	}
	return http.StatusOK, nil
}
