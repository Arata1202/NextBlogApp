package contact

import (
	"errors"
	"os"
	"strings"
)

func loadEmailConfigFromEnv() (emailConfig, error) {
	config := emailConfig{
		To:          strings.TrimSpace(os.Getenv("CONTACT_EMAIL_TO")),
		From:        strings.TrimSpace(os.Getenv("CONTACT_EMAIL_FROM")),
		ResendToken: strings.TrimSpace(os.Getenv("CONTACT_RESEND_API_KEY")),
	}

	if config.To == "" || config.From == "" || len(config.ResendToken) == 0 {
		return emailConfig{}, errors.New("CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM, and CONTACT_RESEND_API_KEY environment variables are required")
	}

	return config, nil
}

func loadSiteConfigFromEnv() siteConfig {
	return siteConfig{
		Title: strings.TrimSpace(os.Getenv("BASE_TITLE")),
		URL:   strings.TrimSpace(os.Getenv("BASE_URL")),
	}
}
