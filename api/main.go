package main

import (
	"log"
	"net/http"

	"NextBlogApp/handler"

	"github.com/joho/godotenv"
)

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "https://realunivlog.com")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	http.Handle("/api/recaptcha", withCORS(http.HandlerFunc(handler.RecaptchaHandler)))
    http.Handle("/api/email", withCORS(http.HandlerFunc(handler.EmailHandler)))
	log.Println("Server started at :8000")
	http.ListenAndServe(":8000", nil)
}
