package recaptcha

import (
	"encoding/json"
	"net/http"
	"net/url"
	"time"
)

var (
	recaptchaVerificationURL = "https://www.google.com/recaptcha/api/siteverify"
	recaptchaHTTPClient      = &http.Client{Timeout: 10 * time.Second}
	verifyRecaptchaFunc      = verifyRecaptcha
)

func verifyRecaptcha(response, secret string) (bool, error) {
	data := url.Values{}
	data.Set("secret", secret)
	data.Set("response", response)

	resp, err := recaptchaHTTPClient.PostForm(recaptchaVerificationURL, data)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	var result siteVerifyResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}
	return result.Success, nil
}

func Verify(response, secret string) (bool, error) {
	return verifyRecaptcha(response, secret)
}
