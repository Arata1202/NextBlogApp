package contact

import (
	"errors"
	"os"
	"strings"
)

func loadEmailConfigFromEnv() (emailConfig, error) {
	config := emailConfig{
		To:       strings.TrimSpace(os.Getenv("EMAIL_TO")),
		From:     strings.TrimSpace(os.Getenv("EMAIL_FROM")),
		SMTPUser: strings.TrimSpace(os.Getenv("SMTP_USER")),
		SMTPPass: strings.TrimSpace(os.Getenv("SMTP_PASS")),
	}

	if config.To == "" || config.From == "" || config.SMTPUser == "" || config.SMTPPass == "" {
		return emailConfig{}, errors.New("EMAIL_TO, EMAIL_FROM, SMTP_USER, and SMTP_PASS environment variables are required")
	}

	return config, nil
}

func loadSiteConfigFromEnv() siteConfig {
	return siteConfig{
		Title: strings.TrimSpace(os.Getenv("BASE_TITLE")),
		URL:   strings.TrimSpace(os.Getenv("BASE_URL")),
	}
}
