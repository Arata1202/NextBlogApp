package httpx

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestReadRequestJSON(t *testing.T) {
	for _, tc := range []struct {
		body   string
		status int
	}{{`{"value":1}`, 200}, {`{}{}`, 400}, {`{}broken`, 400}, {strings.Repeat(" ", 128<<10) + "{}", 413}} {
		r := httptest.NewRequest("POST", "/", strings.NewReader(tc.body))
		var data map[string]any
		if status, err := ReadRequestJSON(httptest.NewRecorder(), r, &data); status != tc.status || (err == nil) != (tc.status == 200) {
			t.Fatalf("status=%d err=%v", status, err)
		}
	}
}
