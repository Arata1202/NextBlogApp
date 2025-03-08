package api

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func Main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/api/recaptcha", RecaptchaHandler)
	http.HandleFunc("/api/sendemail", SendEmailHandler)

	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}