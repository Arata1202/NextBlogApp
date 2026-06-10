package linkchecker

import (
	"net"
	"net/http"
	"net/netip"
	"regexp"
	"time"

	contentops "NextBlogApp/pkg/api/contentops"
)

const (
	microCMSLinkCheckerFields    = "id,title,introduction_blocks,content_blocks,publishedAt,updatedAt"
	microCMSLinkCheckerLimit     = 100
	linkCheckerRunTimeout        = 50 * time.Second
	linkCheckerRequestTimeout    = 10 * time.Second
	linkCheckerSMTPTimeout       = 8 * time.Second
	linkCheckerMaxConcurrency    = 8
	linkCheckerMaxRedirects      = 5
	linkCheckerEmailPreviewLimit = 50

	zennNotificationRequestTimeout = 8 * time.Second
	zennNotificationRunTimeout     = 8 * time.Second
	zennNotificationFeedURL        = "https://zenn.dev/realunivlog/feed"

	cloudflarePagesDeployHookEnv        = "CLOUDFLARE_PAGES_DEPLOY_HOOK_URL"
	cloudflarePagesDeployRequestTimeout = 8 * time.Second
)

var (
	linkCheckerHTTPClient   = &http.Client{Timeout: linkCheckerRequestTimeout}
	linkCheckerAPIBaseURL   = "https://%s.microcms.io/api/v1/blog"
	linkCheckerLookupIPAddr = net.DefaultResolver.LookupIPAddr
	linkCheckerSMTPSend     = sendLinkCheckerSMTPMail

	zennNotificationHTTPClient          = &http.Client{Timeout: zennNotificationRequestTimeout}
	zennNotifyArticlesWithOneSignal     = contentops.NotifyExternalArticlesFirstPublishWithOneSignal
	zennNotificationRequiredEnvVariable = []string{
		"ONESIGNAL_APP_ID",
		"ONESIGNAL_REST_API_KEY",
		"BASE_URL",
		"BASE_TITLE",
		"AWS_ACCESS_KEY_ID",
		"AWS_SECRET_ACCESS_KEY",
		"BUCKET_NAME",
	}
	cloudflarePagesDeployHTTPClient = &http.Client{Timeout: cloudflarePagesDeployRequestTimeout}

	preBlockPattern      = regexp.MustCompile("(?is)<pre\\b[^>]*>.*?</pre>")
	codeBlockPattern     = regexp.MustCompile("(?is)<code\\b[^>]*>.*?</code>")
	anchorTagPattern     = regexp.MustCompile("(?is)<a\\b[^>]*>")
	hrefAttributePattern = regexp.MustCompile("(?is)\\bhref\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s\"'<>`]+))")

	linkCheckerBlockedIPPrefixes = []netip.Prefix{
		netip.MustParsePrefix("0.0.0.0/8"),
		netip.MustParsePrefix("10.0.0.0/8"),
		netip.MustParsePrefix("100.64.0.0/10"),
		netip.MustParsePrefix("127.0.0.0/8"),
		netip.MustParsePrefix("169.254.0.0/16"),
		netip.MustParsePrefix("172.16.0.0/12"),
		netip.MustParsePrefix("192.0.0.0/24"),
		netip.MustParsePrefix("192.0.2.0/24"),
		netip.MustParsePrefix("192.168.0.0/16"),
		netip.MustParsePrefix("198.18.0.0/15"),
		netip.MustParsePrefix("198.51.100.0/24"),
		netip.MustParsePrefix("203.0.113.0/24"),
		netip.MustParsePrefix("224.0.0.0/4"),
		netip.MustParsePrefix("240.0.0.0/4"),
		netip.MustParsePrefix("::/128"),
		netip.MustParsePrefix("::1/128"),
		netip.MustParsePrefix("64:ff9b:1::/48"),
		netip.MustParsePrefix("100::/64"),
		netip.MustParsePrefix("2001:db8::/32"),
		netip.MustParsePrefix("fc00::/7"),
		netip.MustParsePrefix("fe80::/10"),
		netip.MustParsePrefix("ff00::/8"),
	}
)
