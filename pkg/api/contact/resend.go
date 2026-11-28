package contact

import (
	"context"
	"errors"
	"fmt"
	"net/mail"
	"strings"

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

func bareMailbox(address mail.Address) string {
	// net/mail quotes the local part when necessary and encloses the mailbox in angle brackets.
	wire := (&mail.Address{Address: address.Address}).String()
	return strings.TrimSuffix(strings.TrimPrefix(wire, "<"), ">")
}

func (s *resendEmailSender) SendBatch(ctx context.Context, messages []emailMessage, idempotencyKey string) ([]string, error) {
	requests := make([]*resend.SendEmailRequest, 0, len(messages))
	for _, message := range messages {
		to := make([]string, 0, len(message.To))
		for _, recipient := range message.To {
			to = append(to, bareMailbox(recipient))
		}

		requests = append(requests, &resend.SendEmailRequest{
			From:    message.From.String(),
			To:      to,
			ReplyTo: bareMailbox(message.ReplyTo),
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
		if ctx.Err() != nil {
			return nil, ctx.Err()
		}
		// The SDK error can echo recipient addresses and submitted fields into logs.
		return nil, errors.New("resend batch request failed")
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
