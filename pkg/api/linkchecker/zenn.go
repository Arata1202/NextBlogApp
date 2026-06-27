package linkchecker

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/xml"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"
	"time"

	contentops "NextBlogApp/pkg/api/contentops"
)

func zennNotificationsConfigured() bool {
	for _, envName := range zennNotificationRequiredEnvVariable {
		if strings.TrimSpace(os.Getenv(envName)) == "" {
			return false
		}
	}

	return strings.TrimSpace(os.Getenv("AWS_REGION")) != "" || strings.TrimSpace(os.Getenv("AWS_DEFAULT_REGION")) != ""
}

func buildZennNotificationFeedRequest(ctx context.Context) (*http.Request, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, zennNotificationFeedURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8")
	req.Header.Set("User-Agent", "NextBlogApp-ZennNotifier/1.0")

	return req, nil
}

func parseZennRSSPubDate(value string) time.Time {
	value = strings.TrimSpace(value)
	if value == "" {
		return time.Time{}
	}

	for _, layout := range []string{time.RFC1123Z, time.RFC1123} {
		parsed, err := time.Parse(layout, value)
		if err == nil {
			return parsed
		}
	}

	return time.Time{}
}

func zennArticleID(linkURL string) string {
	parsedURL, err := url.Parse(strings.TrimSpace(linkURL))
	if err == nil && strings.EqualFold(parsedURL.Hostname(), "zenn.dev") {
		segments := strings.Split(strings.Trim(parsedURL.EscapedPath(), "/"), "/")
		if len(segments) >= 3 && segments[1] == "articles" {
			if slug, err := url.PathUnescape(segments[2]); err == nil && strings.TrimSpace(slug) != "" {
				return slug
			}
		}
	}

	sum := sha256.Sum256([]byte(strings.TrimSpace(linkURL)))
	return hex.EncodeToString(sum[:16])
}

func zennRSSItemsToNotifications(items []zennRSSItem) []contentops.ExternalArticleNotification {
	notifications := make([]zennRSSArticleNotification, 0, len(items))

	for _, item := range items {
		title := strings.TrimSpace(item.Title)
		linkURL := strings.TrimSpace(item.Link)
		if title == "" || linkURL == "" {
			continue
		}

		notifications = append(notifications, zennRSSArticleNotification{
			article: contentops.ExternalArticleNotification{
				Source:    "zenn",
				ContentID: zennArticleID(linkURL),
				Title:     title,
				URL:       linkURL,
			},
			publishedAt: parseZennRSSPubDate(item.PubDate),
		})
	}

	sort.SliceStable(notifications, func(i, j int) bool {
		if notifications[i].publishedAt.IsZero() || notifications[j].publishedAt.IsZero() {
			return notifications[i].article.URL < notifications[j].article.URL
		}
		return notifications[i].publishedAt.Before(notifications[j].publishedAt)
	})

	articles := make([]contentops.ExternalArticleNotification, 0, len(notifications))
	for _, notification := range notifications {
		articles = append(articles, notification.article)
	}

	return articles
}

func fetchZennRSSNotifications(ctx context.Context) ([]contentops.ExternalArticleNotification, error) {
	req, err := buildZennNotificationFeedRequest(ctx)
	if err != nil {
		return nil, err
	}

	resp, err := zennNotificationHTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer closeResponseBody(resp)

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("Zenn RSS returned status %d", resp.StatusCode)
	}

	var feed zennRSSFeed
	if err := xml.NewDecoder(resp.Body).Decode(&feed); err != nil {
		return nil, err
	}

	return zennRSSItemsToNotifications(feed.Channel.Items), nil
}

func cloudflarePagesDeployHookURL() string {
	return strings.TrimSpace(os.Getenv(cloudflarePagesDeployHookEnv))
}

func cloudflarePagesDeployConfigured() bool {
	return cloudflarePagesDeployHookURL() != ""
}

func buildCloudflarePagesDeployRequest(ctx context.Context, hookURL string) (*http.Request, error) {
	parsedURL, err := url.Parse(strings.TrimSpace(hookURL))
	if err != nil {
		return nil, err
	}
	if parsedURL.Scheme != "https" || parsedURL.Host == "" {
		return nil, errors.New("Cloudflare Pages deploy hook URL must be an HTTPS URL")
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, parsedURL.String(), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "NextBlogApp-ZennNotifier/1.0")

	return req, nil
}

func triggerCloudflarePagesDeploy(ctx context.Context) (cloudflarePagesDeploySummary, error) {
	hookURL := cloudflarePagesDeployHookURL()
	summary := cloudflarePagesDeploySummary{Enabled: hookURL != ""}
	if hookURL == "" {
		return summary, nil
	}

	req, err := buildCloudflarePagesDeployRequest(ctx, hookURL)
	if err != nil {
		return summary, err
	}

	resp, err := cloudflarePagesDeployHTTPClient.Do(req)
	if err != nil {
		return summary, err
	}
	defer closeResponseBody(resp)

	summary.Triggered = true
	summary.StatusCode = resp.StatusCode
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return summary, fmt.Errorf("Cloudflare Pages deploy hook returned status %d", resp.StatusCode)
	}

	return summary, nil
}

func runZennFirstPublishNotifications(ctx context.Context, now time.Time) (*zennNotificationSummary, error) {
	if !zennNotificationsConfigured() {
		return &zennNotificationSummary{Enabled: false}, nil
	}

	articles, err := fetchZennRSSNotifications(ctx)
	if err != nil {
		return nil, err
	}

	results, notifyErr := zennNotifyArticlesWithOneSignal(ctx, articles, now)

	summary := &zennNotificationSummary{
		Enabled:      true,
		CheckedCount: len(articles),
	}

	for _, result := range results {
		if result.MarkerKey != "" {
			summary.MarkerKeys = append(summary.MarkerKeys, result.MarkerKey)
		}
		if result.MarkerCreated {
			summary.NewCount++
		}
		if result.Sent {
			summary.SentCount++
		}
	}
	summary.CloudflarePagesDeploy = &cloudflarePagesDeploySummary{
		Enabled: cloudflarePagesDeployConfigured(),
	}

	if summary.SentCount > 0 {
		log.Printf("Sent %d Zenn first-publish OneSignal notifications", summary.SentCount)
	}

	if summary.NewCount > 0 {
		deploySummary, err := triggerCloudflarePagesDeploy(ctx)
		summary.CloudflarePagesDeploy = &deploySummary
		if err != nil {
			summary.CloudflarePagesDeploy.Error = "failed to trigger deploy"
			return summary, errors.Join(notifyErr, err)
		}
		if deploySummary.Triggered {
			log.Printf("Triggered Cloudflare Pages deploy hook for %d new Zenn articles", summary.NewCount)
		}
	}

	return summary, notifyErr
}

func zennNotificationErrorMessage(err error) string {
	if errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
		return "zenn notification timed out"
	}

	return "failed to run zenn notifications"
}

func zennNotificationErrorDetail(err error) string {
	if err == nil {
		return ""
	}

	const maxLength = 500
	message := strings.TrimSpace(err.Error())
	if len(message) <= maxLength {
		return message
	}

	return message[:maxLength] + "..."
}
