package contact

import (
	"context"
	"fmt"
	"strings"
)

type emailSender interface {
	SendBatch(ctx context.Context, messages []emailMessage, idempotencyKey string) ([]string, error)
}

func sendContactEmails(ctx context.Context, sender emailSender, config emailConfig, site siteConfig, request EmailRequestBody) ([]string, error) {
	messages, err := buildContactMessages(config, site, request)
	if err != nil {
		return nil, err
	}

	ids, err := sender.SendBatch(ctx, messages, buildIdempotencyKey(request))
	if err != nil {
		return nil, fmt.Errorf("send contact email batch: %w", err)
	}
	if len(ids) != len(messages) {
		return nil, fmt.Errorf("send contact email batch: got %d email IDs, want %d", len(ids), len(messages))
	}

	for _, id := range ids {
		if strings.TrimSpace(id) == "" {
			return nil, fmt.Errorf("send contact email batch: received an empty email ID")
		}
	}

	return ids, nil
}

func buildIdempotencyKey(request EmailRequestBody) string {
	return "contact/" + request.RequestID
}
