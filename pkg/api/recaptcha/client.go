package recaptcha

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

var (
	recaptchaVerificationURL = "https://www.google.com/recaptcha/api/siteverify"
	recaptchaHTTPClient      = &http.Client{Timeout: 10 * time.Second}
	verifyRecaptchaFunc      = verifyRecaptcha
)

func verifyRecaptcha(ctx context.Context, response, secret string) (bool, error) {
	data := url.Values{}
	data.Set("secret", secret)
	data.Set("response", response)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, recaptchaVerificationURL, strings.NewReader(data.Encode()))
	if err != nil {
		return false, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := recaptchaHTTPClient.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	if resp.StatusCode/100 != 2 {
		return false, fmt.Errorf("siteverify returned HTTP %d", resp.StatusCode)
	}
	var result siteVerifyResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}
	for _, code := range result.Errors {
		if code == "invalid-input-secret" || code == "missing-input-secret" {
			return false, errors.New("siteverify rejected server credentials")
		}
	}
	return result.Success, nil
}

func Verify(ctx context.Context, response, secret string) (bool, error) {
	return verifyRecaptcha(ctx, response, secret)
}
