package linkchecker

import (
	"io"
	"net/http"
)

func closeResponseBody(resp *http.Response) {
	if resp == nil || resp.Body == nil {
		return
	}

	_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 1024))
	_ = resp.Body.Close()
}
