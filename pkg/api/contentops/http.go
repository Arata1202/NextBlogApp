package contentops

import (
	"io"
	"net/http"
	"strings"

	"NextBlogApp/pkg/api/httpx"
)

func writeMicroCMSBackupJSON(w http.ResponseWriter, statusCode int, response interface{}) {
	httpx.WriteJSON(w, statusCode, response)
}

func closeMicroCMSBackupResponseBody(resp *http.Response) {
	if resp == nil || resp.Body == nil {
		return
	}

	_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 1024))
	_ = resp.Body.Close()
}

func microCMSBackupResponseBodySnippet(resp *http.Response) string {
	if resp == nil || resp.Body == nil {
		return ""
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, 2048))
	_ = resp.Body.Close()
	if err != nil {
		return ""
	}

	return strings.TrimSpace(string(body))
}

func microCMSBackupStringValue(value interface{}) string {
	text, ok := value.(string)
	if !ok {
		return ""
	}

	return text
}

func microCMSBackupFirstString(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}

	return ""
}
