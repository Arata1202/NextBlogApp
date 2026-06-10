package webhook

import (
	"net/http"

	"NextBlogApp/internal/contentops"
)

func MicroCMSBackupHandler(w http.ResponseWriter, r *http.Request) {
	contentops.MicroCMSBackupHandler(w, r)
}
