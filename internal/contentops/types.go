package contentops

import "NextBlogApp/internal/microcms"

type microCMSBackupListResponse = microcms.ListResponse

type awsCredentials struct {
	AccessKeyID     string
	SecretAccessKey string
}

type s3BackupConfig struct {
	BucketName string
	Region     string
}

type microCMSBackupResponse struct {
	Success                   bool   `json:"success"`
	ArticleCount              int    `json:"articleCount"`
	BucketName                string `json:"bucketName"`
	ObjectKey                 string `json:"objectKey"`
	SizeBytes                 int    `json:"sizeBytes"`
	OneSignalNotificationSent bool   `json:"oneSignalNotificationSent"`
	OneSignalMarkerKey        string `json:"oneSignalMarkerKey,omitempty"`
	OneSignalNotificationID   string `json:"oneSignalNotificationId,omitempty"`
}

type microCMSWebhookPayload struct {
	Service  string                       `json:"service"`
	API      string                       `json:"api"`
	ID       string                       `json:"id"`
	Type     string                       `json:"type"`
	Contents *microCMSWebhookPayloadState `json:"contents"`
}

type microCMSWebhookPayloadState struct {
	Old *microCMSWebhookContentState `json:"old"`
	New *microCMSWebhookContentState `json:"new"`
}

type microCMSWebhookContentState struct {
	Status       []string               `json:"status"`
	PublishValue map[string]interface{} `json:"publishValue"`
	DraftValue   map[string]interface{} `json:"draftValue"`
}

type oneSignalConfig struct {
	AppID      string
	RESTAPIKey string
	BaseURL    string
	BaseTitle  string
}

type ExternalArticleNotification struct {
	Source    string
	ContentID string
	Title     string
	URL       string
}

type OneSignalNotificationResult struct {
	Sent           bool
	MarkerCreated  bool
	MarkerKey      string
	NotificationID string
}

type oneSignalNotificationResult = OneSignalNotificationResult
