package turnstile

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const maxSiteVerifyResponseBytes = 1 << 20

var (
	siteVerifyURL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
	httpClient    = &http.Client{Timeout: 10 * time.Second}
)

type siteVerifyResponse struct {
	Success    bool     `json:"success"`
	Hostname   string   `json:"hostname"`
	Action     string   `json:"action"`
	ErrorCodes []string `json:"error-codes"`
}

func Verify(ctx context.Context, token, secret, expectedHostname, expectedAction, idempotencyKey string) (bool, error) {
	form := url.Values{}
	form.Set("secret", secret)
	form.Set("response", token)
	if idempotencyKey != "" {
		form.Set("idempotency_key", idempotencyKey)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, siteVerifyURL, strings.NewReader(form.Encode()))
	if err != nil {
		return false, fmt.Errorf("create Turnstile verification request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := httpClient.Do(req)
	if err != nil {
		return false, fmt.Errorf("send Turnstile verification request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return false, fmt.Errorf("Turnstile verification returned HTTP %d", resp.StatusCode)
	}

	var result siteVerifyResponse
	if err := json.NewDecoder(io.LimitReader(resp.Body, maxSiteVerifyResponseBytes)).Decode(&result); err != nil {
		return false, fmt.Errorf("decode Turnstile verification response: %w", err)
	}
	if !result.Success {
		if isVisitorValidationFailure(result.ErrorCodes) {
			return false, nil
		}

		errorCodes := strings.Join(result.ErrorCodes, ",")
		if errorCodes == "" {
			errorCodes = "unknown-error"
		}
		return false, fmt.Errorf("Turnstile verification failed: %s", errorCodes)
	}
	if !strings.EqualFold(strings.TrimSpace(result.Hostname), strings.TrimSpace(expectedHostname)) {
		return false, nil
	}
	if strings.TrimSpace(result.Action) != strings.TrimSpace(expectedAction) {
		return false, nil
	}

	return true, nil
}

func isVisitorValidationFailure(errorCodes []string) bool {
	if len(errorCodes) == 0 {
		return false
	}

	for _, code := range errorCodes {
		switch code {
		case "missing-input-response", "invalid-input-response", "timeout-or-duplicate":
			continue
		default:
			return false
		}
	}

	return true
}
