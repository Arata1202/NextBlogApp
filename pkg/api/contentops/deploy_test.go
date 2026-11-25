package contentops

import (
	"errors"
	"io"
	"net/http"
	"testing"
	"time"
)

func TestDeployZennFeedRetriesFailedHook(t *testing.T) {
	t.Setenv("BUCKET_NAME", "test-bucket")
	t.Setenv("AWS_REGION", "ap-northeast-1")
	t.Setenv("AWS_ACCESS_KEY_ID", "example")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "example")
	original := microCMSBackupHTTPClient
	t.Cleanup(func() { microCMSBackupHTTPClient = original })
	marker := ""
	microCMSBackupHTTPClient = &http.Client{Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
		if r.URL.Path != "/deployments/zenn/revision.json" {
			t.Fatalf("key=%s", r.URL.Path)
		}
		if r.Method == http.MethodGet {
			return responseWithBody(200, marker), nil
		}
		if r.Header.Get("If-None-Match") == "*" && marker != "" {
			return responseWithBody(412, ""), nil
		}
		body, err := io.ReadAll(r.Body)
		marker = string(body)
		return responseWithBody(200, ""), err
	})}
	calls := 0
	trigger := func() error {
		calls++
		if calls == 1 {
			return errors.New("hook unavailable")
		}
		return nil
	}
	for i := 0; i < 3; i++ {
		err := DeployZennFeed(t.Context(), "revision", time.Now(), trigger)
		if (i == 0) != (err != nil) {
			t.Fatalf("run %d returned %v", i, err)
		}
	}
	if calls != 2 {
		t.Fatalf("hook calls=%d, want 2", calls)
	}
}
