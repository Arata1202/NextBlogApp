package webhook

import (
	"net/http"

	"NextBlogApp/pkg/api/contentops"
)

func MicroCMSBackupHandler(w http.ResponseWriter, r *http.Request) {
	contentops.MicroCMSBackupHandler(w, r)
}
