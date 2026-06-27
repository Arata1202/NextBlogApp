package linkchecker

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"NextBlogApp/pkg/api/httpx"
	"NextBlogApp/pkg/api/monitoring"
)

func writeLinkCheckerJSON(w http.ResponseWriter, statusCode int, response interface{}) {
	httpx.WriteJSON(w, statusCode, response)
}

func LinkCheckerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeLinkCheckerJSON(w, http.StatusMethodNotAllowed, map[string]string{"message": "Method Not Allowed"})
		return
	}

	cronSecret := os.Getenv("CRON_SECRET")
	if cronSecret == "" {
		monitoring.CaptureError(errors.New("CRON_SECRET is missing"), monitoring.EventContext{
			Feature:   "linkchecker",
			Operation: "load_cron_secret",
			Request:   r,
		})
		writeLinkCheckerJSON(w, http.StatusInternalServerError, map[string]string{"message": "CRON_SECRET is missing"})
		return
	}

	if r.Header.Get("Authorization") != "Bearer "+cronSecret {
		writeLinkCheckerJSON(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
		return
	}

	serviceDomain := os.Getenv("MICROCMS_SERVICE_DOMAIN")
	apiKey := os.Getenv("MICROCMS_API_KEY")
	if serviceDomain == "" || apiKey == "" {
		monitoring.CaptureError(errors.New("microCMS link checker environment variables missing"), monitoring.EventContext{
			Feature:   "linkchecker",
			Operation: "load_microcms_env",
			Request:   r,
		})
		writeLinkCheckerJSON(w, http.StatusInternalServerError, map[string]string{"message": "microCMS environment variables missing"})
		return
	}

	zennContext, zennCancel := context.WithTimeout(r.Context(), zennNotificationRunTimeout)
	zennNotifications, err := runZennFirstPublishNotifications(zennContext, time.Now())
	zennCancel()
	if err != nil {
		log.Printf("Failed to run Zenn first-publish notifications: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "zenn_notifications",
			Operation: "run_first_publish_notifications",
			Request:   r,
		})
		if zennNotifications == nil {
			zennNotifications = &zennNotificationSummary{Enabled: zennNotificationsConfigured()}
		}
		zennNotifications.Error = zennNotificationErrorMessage(err)
		zennNotifications.ErrorDetail = zennNotificationErrorDetail(err)
	}

	runContext, cancel := context.WithTimeout(r.Context(), linkCheckerRunTimeout)
	defer cancel()

	articles, err := fetchMicroCMSLinkCheckerArticles(runContext, serviceDomain, apiKey)
	if err != nil {
		if runContext.Err() != nil {
			log.Printf("Link checker timed out while fetching microCMS articles: %v", runContext.Err())
			monitoring.CaptureError(runContext.Err(), monitoring.EventContext{
				Feature:   "linkchecker",
				Operation: "fetch_microcms_articles",
				Request:   r,
			})
			writeLinkCheckerJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "link checker timed out"})
			return
		}
		log.Printf("Failed to fetch microCMS articles for link checker: %v", err)
		monitoring.CaptureError(err, monitoring.EventContext{
			Feature:   "linkchecker",
			Operation: "fetch_microcms_articles",
			Request:   r,
		})
		writeLinkCheckerJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to fetch articles"})
		return
	}

	refsByURL := collectArticlesLinks(articles, linkCheckerBaseURL())
	checkedLinks := checkLinks(runContext, refsByURL)
	if runContext.Err() != nil {
		log.Printf("Link checker timed out after checking %d links: %v", len(checkedLinks), runContext.Err())
		monitoring.CaptureError(runContext.Err(), monitoring.EventContext{
			Feature:   "linkchecker",
			Operation: "check_links",
			Request:   r,
			Extras: map[string]interface{}{
				"checked_count": len(checkedLinks),
			},
		})
		writeLinkCheckerJSON(w, http.StatusGatewayTimeout, map[string]interface{}{
			"message":      "link checker timed out",
			"checkedCount": len(checkedLinks),
		})
		return
	}

	links := brokenLinks(checkedLinks)
	notified := false

	if len(links) > 0 {
		if err := sendLinkCheckerNotification(links); err != nil {
			log.Printf("Failed to send link checker notification: %v", err)
			monitoring.CaptureError(err, monitoring.EventContext{
				Feature:   "linkchecker",
				Operation: "send_notification",
				Request:   r,
				Extras: map[string]interface{}{
					"broken_count": len(links),
				},
			})
			writeLinkCheckerJSON(w, http.StatusInternalServerError, map[string]string{"message": "failed to send notification"})
			return
		}
		notified = true
	}

	writeLinkCheckerJSON(w, http.StatusOK, linkCheckerResponse{
		Success:           true,
		CheckedCount:      len(checkedLinks),
		BrokenCount:       len(links),
		Notified:          notified,
		BrokenLinks:       links,
		ZennNotifications: zennNotifications,
	})
}
