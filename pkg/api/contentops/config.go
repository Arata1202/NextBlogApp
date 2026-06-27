package contentops

import (
	"errors"
	"net/http"
	"time"
)

const (
	microCMSBackupFields            = "id,title,description,categories,tags,thumbnail,introduction_blocks,content_blocks,related_articles,publishedAt,updatedAt"
	microCMSBackupFetchLimit        = 20
	microCMSBackupMinimumFetchLimit = 1
	microCMSBackupRunTimeout        = 50 * time.Second
	microCMSBackupRequestTimeout    = 15 * time.Second
	microCMSBackupContentType       = "text/csv; charset=utf-8"
	s3JSONContentType               = "application/json; charset=utf-8"
	oneSignalSendDelay              = 5 * time.Minute
	oneSignalNotificationTTLSeconds = 24 * 60 * 60
	oneSignalAPIURL                 = "https://api.onesignal.com/notifications"
	oneSignalIncludedSegment        = "Subscribed Users"
	oneSignalMarkerStatusPending    = "pending"
	oneSignalMarkerStatusSent       = "sent"
)

var (
	microCMSBackupHTTPClient = &http.Client{Timeout: microCMSBackupRequestTimeout}
	microCMSBackupAPIBaseURL = "https://%s.microcms.io/api/v1/blog"
	microCMSBackupNow        = time.Now
	errS3ObjectAlreadyExists = errors.New("s3 object already exists")

	oneSignalIdempotencyNamespace = [16]byte{0x6b, 0xa7, 0xb8, 0x10, 0x9d, 0xad, 0x11, 0xd1, 0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8}
)
