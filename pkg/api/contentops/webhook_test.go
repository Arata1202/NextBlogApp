package contentops

import (
	"testing"
)

func TestIsMicroCMSFirstPublishWebhook(t *testing.T) {
	for _, testCase := range []struct {
		name    string
		payload microCMSWebhookPayload
		want    bool
	}{
		{
			name: "new published content",
			payload: microCMSWebhookPayload{
				API:  "blog",
				ID:   "article-a",
				Type: "new",
				Contents: &microCMSWebhookPayloadState{
					New: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
				},
			},
			want: true,
		},
		{
			name: "draft to published content",
			payload: microCMSWebhookPayload{
				API:  "blog",
				ID:   "article-a",
				Type: "edit",
				Contents: &microCMSWebhookPayloadState{
					Old: &microCMSWebhookContentState{Status: []string{"DRAFT"}},
					New: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
				},
			},
			want: true,
		},
		{
			name: "published content update",
			payload: microCMSWebhookPayload{
				API:  "blog",
				ID:   "article-a",
				Type: "edit",
				Contents: &microCMSWebhookPayloadState{
					Old: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
					New: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
				},
			},
			want: false,
		},
		{
			name: "non blog api",
			payload: microCMSWebhookPayload{
				API:  "categories",
				ID:   "category-a",
				Type: "new",
				Contents: &microCMSWebhookPayloadState{
					New: &microCMSWebhookContentState{Status: []string{"PUBLISH"}},
				},
			},
			want: false,
		},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			if got := isMicroCMSFirstPublishWebhook(testCase.payload); got != testCase.want {
				t.Fatalf("isMicroCMSFirstPublishWebhook() = %t, want %t", got, testCase.want)
			}
		})
	}
}

func TestIsMicroCMSSponsoredArticle(t *testing.T) {
	for _, testCase := range []struct {
		name    string
		value   interface{}
		want    bool
	}{
		{name: "sponsored article", value: true, want: true},
		{name: "regular article", value: false, want: false},
		{name: "missing flag", value: nil, want: false},
		{name: "invalid flag", value: "true", want: false},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			publishValue := map[string]interface{}{"title": "Article A"}
			if testCase.value != nil {
				publishValue["isSponsored"] = testCase.value
			}
			payload := microCMSWebhookPayload{
				Contents: &microCMSWebhookPayloadState{
					New: &microCMSWebhookContentState{PublishValue: publishValue},
				},
			}

			if got := isMicroCMSSponsoredArticle(payload); got != testCase.want {
				t.Fatalf("isMicroCMSSponsoredArticle() = %t, want %t", got, testCase.want)
			}
		})
	}
}
