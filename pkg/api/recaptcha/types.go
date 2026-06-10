package recaptcha

type RecaptchaRequest struct {
	RecaptchaResponse string `json:"g-recaptcha-response"`
}

type RecaptchaResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type siteVerifyResponse struct {
	Success bool `json:"success"`
}
