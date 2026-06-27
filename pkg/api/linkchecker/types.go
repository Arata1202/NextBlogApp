package linkchecker

import (
	"time"

	contentops "NextBlogApp/pkg/api/contentops"
	"NextBlogApp/pkg/api/microcms"
)

type microCMSLinkCheckerListResponse = microcms.ListResponse

type linkReference struct {
	ArticleID    string `json:"articleId"`
	ArticleTitle string `json:"articleTitle,omitempty"`
	Field        string `json:"field"`
}

type linkCheckResult struct {
	URL        string          `json:"url"`
	StatusCode int             `json:"statusCode,omitempty"`
	Error      string          `json:"error,omitempty"`
	References []linkReference `json:"references"`
	broken     bool
}

type linkCheckerResponse struct {
	Success           bool                     `json:"success"`
	CheckedCount      int                      `json:"checkedCount"`
	BrokenCount       int                      `json:"brokenCount"`
	Notified          bool                     `json:"notified"`
	BrokenLinks       []linkCheckResult        `json:"brokenLinks"`
	ZennNotifications *zennNotificationSummary `json:"zennNotifications,omitempty"`
}

type zennRSSFeed struct {
	Channel zennRSSChannel `xml:"channel"`
}

type zennRSSChannel struct {
	Items []zennRSSItem `xml:"item"`
}

type zennRSSItem struct {
	Title   string `xml:"title"`
	Link    string `xml:"link"`
	PubDate string `xml:"pubDate"`
}

type zennNotificationSummary struct {
	Enabled               bool                          `json:"enabled"`
	CheckedCount          int                           `json:"checkedCount"`
	NewCount              int                           `json:"newCount"`
	SentCount             int                           `json:"sentCount"`
	MarkerKeys            []string                      `json:"markerKeys,omitempty"`
	CloudflarePagesDeploy *cloudflarePagesDeploySummary `json:"cloudflarePagesDeploy,omitempty"`
	Error                 string                        `json:"error,omitempty"`
}

type cloudflarePagesDeploySummary struct {
	Enabled    bool   `json:"enabled"`
	Triggered  bool   `json:"triggered"`
	StatusCode int    `json:"statusCode,omitempty"`
	Error      string `json:"error,omitempty"`
}

type zennRSSArticleNotification struct {
	article     contentops.ExternalArticleNotification
	publishedAt time.Time
}
