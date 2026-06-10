package contentops

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"strings"
)

func microCMSWebhookStatusIncludes(state *microCMSWebhookContentState, status string) bool {
	if state == nil {
		return false
	}

	for _, currentStatus := range state.Status {
		if strings.EqualFold(currentStatus, status) {
			return true
		}
	}

	return false
}

func isMicroCMSFirstPublishWebhook(payload microCMSWebhookPayload) bool {
	if payload.API != "blog" || strings.TrimSpace(payload.ID) == "" || payload.Type == "delete" || payload.Contents == nil {
		return false
	}

	oldPublished := microCMSWebhookStatusIncludes(payload.Contents.Old, "PUBLISH")
	newPublished := microCMSWebhookStatusIncludes(payload.Contents.New, "PUBLISH")

	return !oldPublished && newPublished
}

func microCMSWebhookPublishedValue(payload microCMSWebhookPayload) map[string]interface{} {
	if payload.Contents == nil || payload.Contents.New == nil {
		return nil
	}

	if payload.Contents.New.PublishValue != nil {
		return payload.Contents.New.PublishValue
	}

	return payload.Contents.New.DraftValue
}

func microCMSWebhookArticleTitle(payload microCMSWebhookPayload) string {
	publishedValue := microCMSWebhookPublishedValue(payload)
	if publishedValue == nil {
		return ""
	}

	return strings.TrimSpace(microCMSBackupStringValue(publishedValue["title"]))
}

func expectedMicroCMSWebhookSignature(body []byte, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	return hex.EncodeToString(mac.Sum(nil))
}

func verifyMicroCMSWebhookSignature(body []byte, secret, signature string) bool {
	signatureBytes, err := hex.DecodeString(strings.TrimSpace(signature))
	if err != nil {
		return false
	}

	expectedSignatureBytes, err := hex.DecodeString(expectedMicroCMSWebhookSignature(body, secret))
	if err != nil {
		return false
	}

	return hmac.Equal(signatureBytes, expectedSignatureBytes)
}
