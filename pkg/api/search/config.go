package search

import (
	"net/http"
	"regexp"
	"sync"
	"time"
)

const (
	microCMSSearchFields    = "id,title,description,thumbnail,categories,tags,introduction_blocks,content_blocks,publishedAt,updatedAt"
	microCMSListFetchLimit  = 100
	microCMSSearchLimit     = 10
	microCMSSearchLimitMax  = 50
	microCMSSearchOffsetMax = 10000
	microCMSSearchCacheTTL  = 5 * time.Minute

	zennSearchFeedURL              = "https://zenn.dev/realunivlog/feed?all=1"
	zennSearchRequestTimeout       = 3 * time.Second
	zennSearchCacheTTL             = time.Hour
	zennSearchFallbackThumbnailURL = "/images/blog/title.webp"
	searchDescriptionMaxLength     = 140
	searchScoreField               = "_searchScore"
	searchContentField             = "_searchContent"
)

var (
	microCMSSearchHTTPClient = &http.Client{Timeout: 10 * time.Second}
	zennSearchHTTPClient     = &http.Client{Timeout: zennSearchRequestTimeout}
	microCMSSearchAPIBaseURL = "https://%s.microcms.io/api/v1/blog"
	htmlTagPattern           = regexp.MustCompile(`<[^>]*>`)
	htmlImageSourcePattern   = regexp.MustCompile(`(?i)<img[^>]+src=["']([^"']+)["']`)
	microCMSSearchNow        = time.Now
	microCMSSearchCache      = struct {
		sync.RWMutex
		serviceDomain string
		apiKey        string
		articles      []map[string]interface{}
		expiresAt     time.Time
	}{}
	zennSearchCache = struct {
		sync.RWMutex
		articles  []map[string]interface{}
		expiresAt time.Time
	}{}
)
