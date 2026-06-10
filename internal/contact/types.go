package contact

type EmailRequestBody struct {
	Title             string `json:"title"`
	Email             string `json:"email"`
	Message           string `json:"message"`
	RecaptchaResponse string `json:"g-recaptcha-response"`
}

type emailConfig struct {
	To       string
	From     string
	SMTPUser string
	SMTPPass string
}

type siteConfig struct {
	Title string
	URL   string
}

type statusResponse struct {
	Status string `json:"status"`
}

type successResponse struct {
	Success bool `json:"success"`
}
