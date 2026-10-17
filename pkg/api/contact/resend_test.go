package contact

import (
	"context"
	"errors"
	"net/mail"
	"strings"
	"testing"

	"github.com/resend/resend-go/v4"
)

type fakeResendBatchClient struct {
	requests []*resend.SendEmailRequest
	options  *resend.BatchSendEmailOptions
	response *resend.BatchEmailResponse
	err      error
}

func (f *fakeResendBatchClient) SendWithOptions(_ context.Context, requests []*resend.SendEmailRequest, options *resend.BatchSendEmailOptions) (*resend.BatchEmailResponse, error) {
	f.requests = requests
	f.options = options
	return f.response, f.err
}

func TestResendEmailSenderSendsStrictIdempotentBatch(t *testing.T) {
	client := &fakeResendBatchClient{
		response: &resend.BatchEmailResponse{Data: []resend.SendEmailResponse{{Id: "owner-id"}, {Id: "user-id"}}},
	}
	sender := &resendEmailSender{batch: client}
	messages := []emailMessage{
		{
			From:    mail.Address{Name: "Real Univ Log", Address: "contact@example.com"},
			To:      []mail.Address{{Address: "owner@example.com"}},
			ReplyTo: mail.Address{Address: "user@example.com"},
			Subject: "Owner subject",
			HTML:    "<p>Owner</p>",
			Text:    "Owner",
		},
		{
			From:    mail.Address{Name: "Real Univ Log", Address: "contact@example.com"},
			To:      []mail.Address{{Address: "user@example.com"}},
			ReplyTo: mail.Address{Address: "contact@example.com"},
			Subject: "User subject",
			HTML:    "<p>User</p>",
			Text:    "User",
		},
	}

	ids, err := sender.SendBatch(context.Background(), messages, "contact/request-id")
	if err != nil {
		t.Fatalf("SendBatch() error = %v", err)
	}
	if len(ids) != 2 || ids[0] != "owner-id" || ids[1] != "user-id" {
		t.Fatalf("ids = %v", ids)
	}
	if len(client.requests) != 2 {
		t.Fatalf("requests = %d, want 2", len(client.requests))
	}
	if client.options == nil || client.options.IdempotencyKey != "contact/request-id" {
		t.Fatalf("options = %#v", client.options)
	}
	if client.options.BatchValidation != resend.BatchValidationStrict {
		t.Fatalf("BatchValidation = %q", client.options.BatchValidation)
	}

	owner := client.requests[0]
	if owner.From != messages[0].From.String() || len(owner.To) != 1 || owner.To[0] != "owner@example.com" {
		t.Fatalf("owner request = %#v", owner)
	}
	if owner.ReplyTo != "user@example.com" || owner.Subject != "Owner subject" || owner.Html == "" || owner.Text == "" {
		t.Fatalf("owner request = %#v", owner)
	}

	confirmation := client.requests[1]
	if len(confirmation.To) != 1 || confirmation.To[0] != "user@example.com" {
		t.Fatalf("confirmation request = %#v", confirmation)
	}
	if confirmation.ReplyTo != "contact@example.com" {
		t.Fatalf("confirmation ReplyTo = %q", confirmation.ReplyTo)
	}
}

func TestResendEmailSenderHandlesProviderFailures(t *testing.T) {
	tests := []struct {
		name     string
		response *resend.BatchEmailResponse
		err      error
	}{
		{name: "request error", err: errors.New("network error")},
		{name: "nil response"},
		{name: "validation errors", response: &resend.BatchEmailResponse{Errors: []resend.BatchError{{Index: 0, Message: "invalid"}}}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client := &fakeResendBatchClient{response: tt.response, err: tt.err}
			sender := &resendEmailSender{batch: client}
			_, err := sender.SendBatch(context.Background(), []emailMessage{{
				From:    mail.Address{Address: "contact@example.com"},
				To:      []mail.Address{{Address: "user@example.com"}},
				ReplyTo: mail.Address{Address: "contact@example.com"},
				Subject: "Subject",
				HTML:    "<p>Body</p>",
				Text:    "Body",
			}}, "contact/request-id")
			if err == nil || !strings.Contains(err.Error(), "resend batch request") {
				t.Fatalf("SendBatch() error = %v", err)
			}
		})
	}
}
