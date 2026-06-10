package contact

import (
	"fmt"
	"net/mail"
	"strings"
	"unicode"
	"unicode/utf8"
)

const (
	maxEmailLength   = 254
	maxTitleLength   = 200
	maxMessageLength = 5000
)

func sanitizeEmailContent(value string, keepLineBreaks bool) string {
	lineBreakReplacement := " "
	if keepLineBreaks {
		lineBreakReplacement = "\n"
	}

	normalizedValue := strings.ReplaceAll(value, "\r\n", lineBreakReplacement)
	normalizedValue = strings.ReplaceAll(normalizedValue, "\r", lineBreakReplacement)
	normalizedValue = strings.ReplaceAll(normalizedValue, "\n", lineBreakReplacement)

	return strings.Map(func(r rune) rune {
		if unicode.IsControl(r) && r != '\t' && !(keepLineBreaks && r == '\n') {
			return -1
		}

		return r
	}, normalizedValue)
}

func sanitizeEmailLineContent(value string) string {
	return sanitizeEmailContent(value, false)
}

func sanitizeEmailBodyContent(value string) string {
	return sanitizeEmailContent(value, true)
}

func containsDisallowedEmailContentCharacters(value string, allowLineBreaks bool) bool {
	if !utf8.ValidString(value) {
		return true
	}

	for _, r := range value {
		if unicode.IsPrint(r) || r == '\t' || (allowLineBreaks && r == '\n') {
			continue
		}

		return true
	}

	return false
}

func validateEmailTextField(name, value string, maxLength int, allowLineBreaks bool) error {
	if utf8.RuneCountInString(value) > maxLength {
		return fmt.Errorf("%s is too long", name)
	}
	if containsDisallowedEmailContentCharacters(value, allowLineBreaks) {
		return fmt.Errorf("%s contains disallowed characters", name)
	}

	return nil
}

func validateEmailRequestInput(req *EmailRequestBody) error {
	req.Email = strings.TrimSpace(req.Email)
	if len(req.Email) > maxEmailLength {
		return fmt.Errorf("email is too long")
	}
	if containsDisallowedEmailContentCharacters(req.Email, false) {
		return fmt.Errorf("email contains disallowed characters")
	}
	parsedAddress, err := mail.ParseAddress(req.Email)
	if err != nil {
		return fmt.Errorf("invalid email address: %w", err)
	}
	if parsedAddress.Address != req.Email {
		return fmt.Errorf("email must be an addr-spec")
	}

	if err := validateEmailTextField("title", req.Title, maxTitleLength, false); err != nil {
		return err
	}
	if err := validateEmailTextField("message", req.Message, maxMessageLength, true); err != nil {
		return err
	}

	return nil
}
