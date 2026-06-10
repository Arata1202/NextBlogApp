package contact

import (
	"fmt"
	"net/mail"
	"net/smtp"
)

var smtpSendMail = smtp.SendMail

func sendEmail(emailTo, emailFrom, smtpUser, smtpPass, userEmail, title, message string) error {
	return sendEmailWithConfig(emailConfig{
		To:       emailTo,
		From:     emailFrom,
		SMTPUser: smtpUser,
		SMTPPass: smtpPass,
	}, loadSiteConfigFromEnv(), userEmail, title, message)
}

func sendEmailWithConfig(config emailConfig, site siteConfig, userEmail, title, message string) error {
	from, err := formatNamedHeaderAddress(site.Title, config.From)
	if err != nil {
		return fmt.Errorf("invalid sender address: %w", err)
	}

	ownerAddress, err := formatHeaderAddress(config.To)
	if err != nil {
		return fmt.Errorf("invalid owner address: %w", err)
	}

	userAddress, err := formatHeaderAddress(userEmail)
	if err != nil {
		return fmt.Errorf("invalid user address: %w", err)
	}

	recipients := []mail.Address{ownerAddress, userAddress}
	recipientAddresses := []string{ownerAddress.Address, userAddress.Address}
	msg := buildEmailMessage(site, from.Address, userEmail, title, message, recipients)

	const smtpHost = "smtp.gmail.com"
	const smtpPort = "587"
	auth := smtp.PlainAuth("", config.SMTPUser, config.SMTPPass, smtpHost)

	return smtpSendMail(smtpHost+":"+smtpPort, auth, from.Address, recipientAddresses, []byte(msg))
}
