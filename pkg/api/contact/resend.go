package contact

import (
	"context"
	"fmt"

	"github.com/resend/resend-go/v4"
)

type resendBatchClient interface {
	SendWithOptions(ctx context.Context, params []*resend.SendEmailRequest, options *resend.BatchSendEmailOptions) (*resend.BatchEmailResponse, error)
}

type resendEmailSender struct {
	batch resendBatchClient
}

func newResendEmailSender(token string) emailSender {
	client := resend.NewClient(token)
	return &resendEmailSender{batch: client.Batch}
}

func (s *resendEmailSender) SendBatch(ctx context.Context, messages []emailMessage, idempotencyKey string) ([]string, error) {
	requests := make([]*resend.SendEmailRequest, 0, len(messages))
	for _, message := range messages {
		to := make([]string, 0, len(message.To))
		for _, recipient := range message.To {
			to = append(to, recipient.Address)
		}

		requests = append(requests, &resend.SendEmailRequest{
			From:    message.From.String(),
			To:      to,
			ReplyTo: message.ReplyTo.Address,
			Subject: message.Subject,
			Html:    message.HTML,
			Text:    message.Text,
		})
	}

	response, err := s.batch.SendWithOptions(ctx, requests, &resend.BatchSendEmailOptions{
		IdempotencyKey:  idempotencyKey,
		BatchValidation: resend.BatchValidationStrict,
	})
	if err != nil {
		return nil, fmt.Errorf("resend batch request: %w", err)
	}
	if response == nil {
		return nil, fmt.Errorf("resend batch request: empty response")
	}
	if len(response.Errors) > 0 {
		return nil, fmt.Errorf("resend batch request: returned %d validation errors", len(response.Errors))
	}

	ids := make([]string, 0, len(response.Data))
	for _, email := range response.Data {
		ids = append(ids, email.Id)
	}

	return ids, nil
}
