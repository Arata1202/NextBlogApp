package contentops

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"os"

	"NextBlogApp/internal/monitoring"
)

func MicroCMSBackupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeMicroCMSBackupJSON(w, http.StatusMethodNotAllowed, map[string]string{"message": "Method Not Allowed"})
		return
	}

	defer r.Body.Close()
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 1024*1024))
	if err != nil {
		writeMicroCMSBackupJSON(w, http.StatusBadRequest, map[string]string{"message": "invalid webhook body"})
		return
	}

	webhookSecret := os.Getenv("MICROCMS_WEBHOOK_SECRET")
	if webhookSecret == "" {
		monitoring.CaptureError(errors.New("MICROCMS_WEBHOOK_SECRET is missing"), monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "load_webhook_secret",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "MICROCMS_WEBHOOK_SECRET is missing"})
		return
	}

	if !verifyMicroCMSWebhookSignature(body, webhookSecret, r.Header.Get("x-microcms-signature")) {
		writeMicroCMSBackupJSON(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
		return
	}

	var webhookPayload microCMSWebhookPayload
	if err := json.Unmarshal(body, &webhookPayload); err != nil {
		writeMicroCMSBackupJSON(w, http.StatusBadRequest, map[string]string{"message": "invalid webhook json"})
		return
	}

	serviceDomain := os.Getenv("MICROCMS_SERVICE_DOMAIN")
	apiKey := os.Getenv("MICROCMS_API_KEY")
	if serviceDomain == "" || apiKey == "" {
		monitoring.CaptureError(errors.New("microCMS backup environment variables missing"), monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "load_microcms_env",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "microCMS environment variables missing"})
		return
	}

	s3Config, credentials, err := loadS3BackupConfigFromEnv()
	if err != nil {
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "load_s3_env",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	runContext, cancel := context.WithTimeout(r.Context(), microCMSBackupRunTimeout)
	defer cancel()

	articles, err := fetchMicroCMSBackupArticles(runContext, serviceDomain, apiKey)
	if err != nil {
		if runContext.Err() != nil {
			log.Printf("microCMS backup timed out while fetching articles: %v", runContext.Err())
			monitoring.CaptureError(runContext.Err(), monitoring.EventContext{
				Feature:   "microcms_backup",
				Operation: "fetch_microcms_articles",
				Request:   r,
			})
			writeMicroCMSBackupJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "microCMS backup timed out"})
			return
		}
		log.Printf("Failed to fetch microCMS articles for backup: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "fetch_microcms_articles",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to fetch articles"})
		return
	}

	var csvBuffer bytes.Buffer
	if err := writeMicroCMSBackupCSV(&csvBuffer, articles); err != nil {
		log.Printf("Failed to build microCMS backup CSV: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "build_backup_csv",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusInternalServerError, map[string]string{"message": "failed to build backup csv"})
		return
	}

	now := microCMSBackupNow()
	objectKey := microCMSBackupObjectKey(now)
	csvBody := csvBuffer.Bytes()
	if err := uploadMicroCMSBackupToS3(runContext, s3Config, credentials, objectKey, csvBody, now); err != nil {
		if runContext.Err() != nil {
			log.Printf("microCMS backup timed out while uploading to S3: %v", runContext.Err())
			monitoring.CaptureError(runContext.Err(), monitoring.EventContext{
				Feature:   "microcms_backup",
				Operation: "upload_backup_to_s3",
				Request:   r,
			})
			writeMicroCMSBackupJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "microCMS backup timed out"})
			return
		}
		log.Printf("Failed to upload microCMS backup to S3: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "upload_backup_to_s3",
			Request:   r,
		})
		writeMicroCMSBackupJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to upload backup"})
		return
	}

	notificationResult, err := notifyMicroCMSFirstPublishWithOneSignal(runContext, s3Config, credentials, webhookPayload, now)
	if err != nil {
		if runContext.Err() != nil {
			log.Printf("microCMS backup timed out while sending OneSignal notification: %v", runContext.Err())
			monitoring.CaptureError(runContext.Err(), monitoring.EventContext{
				Feature:   "microcms_backup",
				Operation: "send_onesignal_notification",
				Request:   r,
			})
			writeMicroCMSBackupJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "microCMS backup timed out"})
			return
		}
		log.Printf("Failed to send OneSignal notification for microCMS content %s: %v", webhookPayload.ID, err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "microcms_backup",
			Operation: "send_onesignal_notification",
			Request:   r,
			Extras: map[string]interface{}{
				"content_id": webhookPayload.ID,
			},
		})
		writeMicroCMSBackupJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to send notification"})
		return
	}

	writeMicroCMSBackupJSON(w, http.StatusOK, microCMSBackupResponse{
		Success:                   true,
		ArticleCount:              len(articles),
		BucketName:                s3Config.BucketName,
		ObjectKey:                 objectKey,
		SizeBytes:                 len(csvBody),
		OneSignalNotificationSent: notificationResult.Sent,
		OneSignalMarkerKey:        notificationResult.MarkerKey,
		OneSignalNotificationID:   notificationResult.NotificationID,
	})
}
