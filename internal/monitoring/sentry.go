package monitoring

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/getsentry/sentry-go"
)

const sentryFlushTimeout = 2 * time.Second

type EventContext struct {
	Feature   string
	Operation string
	Request   *http.Request
	Tags      map[string]string
	Extras    map[string]interface{}
}

var (
	sentryInitOnce sync.Once
	sentryInitErr  error
)

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		trimmedValue := strings.TrimSpace(value)
		if trimmedValue != "" {
			return trimmedValue
		}
	}

	return ""
}

func initSentry() bool {
	dsn := strings.TrimSpace(os.Getenv("SENTRY_DSN"))
	if dsn == "" {
		return false
	}

	sentryInitOnce.Do(func() {
		sentryInitErr = sentry.Init(sentry.ClientOptions{
			Dsn:              dsn,
			Environment:      firstNonEmpty(os.Getenv("VERCEL_ENV"), os.Getenv("GO_ENV")),
			Release:          strings.TrimSpace(os.Getenv("VERCEL_GIT_COMMIT_SHA")),
			AttachStacktrace: true,
		})
		if sentryInitErr != nil {
			log.Printf("Failed to initialize Sentry: %v", sentryInitErr)
		}
	})

	return sentryInitErr == nil
}

func applyScope(scope *sentry.Scope, eventContext EventContext) {
	if eventContext.Feature != "" {
		scope.SetTag("feature", eventContext.Feature)
	}
	if eventContext.Operation != "" {
		scope.SetTag("operation", eventContext.Operation)
	}

	for key, value := range eventContext.Tags {
		if key != "" && value != "" {
			scope.SetTag(key, value)
		}
	}

	details := sentry.Context{}
	for key, value := range eventContext.Extras {
		if key != "" {
			details[key] = value
		}
	}

	if eventContext.Request != nil {
		details["request_method"] = eventContext.Request.Method
		if eventContext.Request.URL != nil {
			details["request_path"] = eventContext.Request.URL.Path
		}
		if eventContext.Request.Host != "" {
			details["request_host"] = eventContext.Request.Host
		}
	}

	if len(details) > 0 {
		scope.SetContext("details", details)
	}
}

func CaptureError(err error, eventContext EventContext) {
	if err == nil || !initSentry() {
		return
	}

	hub := sentry.CurrentHub().Clone()
	hub.ConfigureScope(func(scope *sentry.Scope) {
		applyScope(scope, eventContext)
	})
	hub.CaptureException(err)
	sentry.Flush(sentryFlushTimeout)
}

func CaptureMessage(message string, eventContext EventContext) {
	if strings.TrimSpace(message) == "" {
		return
	}

	CaptureError(errors.New(message), eventContext)
}
