package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"NextBlogApp/api"
	cronapi "NextBlogApp/api/cron"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	http.HandleFunc("/api/recaptcha", api.RecaptchaHandler)
	http.HandleFunc("/api/sendemail", api.SendEmailHandler)
	http.HandleFunc("/api/search", api.SearchHandler)
	http.HandleFunc("/api/cron/linkchecker", cronapi.LinkCheckerHandler)

	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
