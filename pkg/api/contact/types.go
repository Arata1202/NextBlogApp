package contact

import "net/mail"

type EmailRequestBody struct {
	RequestID         string `json:"requestId"`
	Title             string `json:"title"`
	Email             string `json:"email"`
	Message           string `json:"message"`
	RecaptchaResponse string `json:"g-recaptcha-response"`
}

type emailConfig struct {
	To          string
	From        string
	ResendToken string
}

type siteConfig struct {
	Title string
	URL   string
}

type emailMessage struct {
	From    mail.Address
	To      []mail.Address
	ReplyTo mail.Address
	Subject string
	HTML    string
	Text    string
}

type statusResponse struct {
	Status string `json:"status"`
}

type successResponse struct {
	Success bool `json:"success"`
}
