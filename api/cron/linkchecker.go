package cron

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"io"
	"log"
	"mime"
	"net"
	"net/http"
	"net/mail"
	"net/netip"
	"net/smtp"
	"net/url"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
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
)

var (
	linkCheckerHTTPClient   = &http.Client{Timeout: linkCheckerRequestTimeout}
	linkCheckerAPIBaseURL   = "https://%s.microcms.io/api/v1/blog"
	linkCheckerLookupIPAddr = net.DefaultResolver.LookupIPAddr
	linkCheckerSMTPSend     = sendLinkCheckerSMTPMail

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

type microCMSLinkCheckerListResponse struct {
	Contents   []map[string]interface{} `json:"contents"`
	TotalCount int                      `json:"totalCount"`
	Offset     int                      `json:"offset"`
	Limit      int                      `json:"limit"`
}

type linkReference struct {
	ArticleID    string `json:"articleId"`
	ArticleTitle string `json:"articleTitle,omitempty"`
	Field        string `json:"field"`
}

type linkCheckResult struct {
	URL        string          `json:"url"`
	StatusCode int             `json:"statusCode,omitempty"`
	Error      string          `json:"error,omitempty"`
	References []linkReference `json:"references"`
	broken     bool
}

type linkCheckerResponse struct {
	Success      bool              `json:"success"`
	CheckedCount int               `json:"checkedCount"`
	BrokenCount  int               `json:"brokenCount"`
	Notified     bool              `json:"notified"`
	BrokenLinks  []linkCheckResult `json:"brokenLinks"`
}

func writeLinkCheckerJSON(w http.ResponseWriter, statusCode int, response interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Failed to encode link checker response: %v", err)
	}
}

func buildMicroCMSLinkCheckerRequest(ctx context.Context, serviceDomain, apiKey string, limit, offset int) (*http.Request, error) {
	apiURL, err := url.Parse(fmt.Sprintf(linkCheckerAPIBaseURL, strings.TrimSpace(serviceDomain)))
	if err != nil {
		return nil, err
	}

	params := apiURL.Query()
	params.Set("limit", strconv.Itoa(limit))
	params.Set("offset", strconv.Itoa(offset))
	params.Set("fields", microCMSLinkCheckerFields)
	apiURL.RawQuery = params.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, apiURL.String(), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-MICROCMS-API-KEY", apiKey)
	req.Header.Set("Accept", "application/json")

	return req, nil
}

func fetchMicroCMSLinkCheckerArticles(ctx context.Context, serviceDomain, apiKey string) ([]map[string]interface{}, error) {
	articles := []map[string]interface{}{}

	for offset := 0; ; offset += microCMSLinkCheckerLimit {
		req, err := buildMicroCMSLinkCheckerRequest(ctx, serviceDomain, apiKey, microCMSLinkCheckerLimit, offset)
		if err != nil {
			return nil, err
		}

		resp, err := linkCheckerHTTPClient.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
			closeResponseBody(resp)
			return nil, fmt.Errorf("microCMS returned status %d", resp.StatusCode)
		}

		var listResponse microCMSLinkCheckerListResponse
		if err := json.NewDecoder(resp.Body).Decode(&listResponse); err != nil {
			closeResponseBody(resp)
			return nil, err
		}
		closeResponseBody(resp)

		articles = append(articles, listResponse.Contents...)
		if len(articles) >= listResponse.TotalCount || len(listResponse.Contents) == 0 {
			return articles, nil
		}
	}
}

func closeResponseBody(resp *http.Response) {
	if resp == nil || resp.Body == nil {
		return
	}

	_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 1024))
	_ = resp.Body.Close()
}

func stringValue(value interface{}) string {
	text, ok := value.(string)
	if !ok {
		return ""
	}

	return text
}

func firstString(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}

	return ""
}

func linkCheckerBaseURL() string {
	return strings.TrimSpace(os.Getenv("BASE_URL"))
}

func normalizeLinkURL(rawLink, baseURL string) (string, bool) {
	rawLink = strings.TrimSpace(html.UnescapeString(rawLink))
	rawLink = strings.Trim(rawLink, `"'`)
	if rawLink == "" || strings.HasPrefix(rawLink, "#") {
		return "", false
	}

	lowerLink := strings.ToLower(rawLink)
	for _, skippedPrefix := range []string{"mailto:", "tel:", "javascript:", "data:", "sms:"} {
		if strings.HasPrefix(lowerLink, skippedPrefix) {
			return "", false
		}
	}

	if strings.HasPrefix(rawLink, "//") {
		rawLink = "https:" + rawLink
	}

	parsedURL, err := url.Parse(rawLink)
	if err != nil {
		return "", false
	}

	if parsedURL.Scheme == "" {
		if baseURL == "" {
			return "", false
		}

		baseParsedURL, err := url.Parse(baseURL)
		if err != nil || baseParsedURL.Scheme == "" || baseParsedURL.Host == "" {
			return "", false
		}

		parsedURL = baseParsedURL.ResolveReference(parsedURL)
	}

	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		return "", false
	}

	parsedURL.Fragment = ""

	return parsedURL.String(), true
}

func appendLinkReference(refsByURL map[string][]linkReference, rawLink string, ref linkReference, baseURL string) {
	normalizedURL, ok := normalizeLinkURL(rawLink, baseURL)
	if !ok {
		return
	}

	for _, existingRef := range refsByURL[normalizedURL] {
		if existingRef == ref {
			return
		}
	}

	refsByURL[normalizedURL] = append(refsByURL[normalizedURL], ref)
}

func stripCodeBlocks(text string) string {
	text = preBlockPattern.ReplaceAllString(text, "")
	return codeBlockPattern.ReplaceAllString(text, "")
}

func extractTextLinks(refsByURL map[string][]linkReference, text string, ref linkReference, baseURL string) {
	text = stripCodeBlocks(text)

	for _, anchorTag := range anchorTagPattern.FindAllString(text, -1) {
		match := hrefAttributePattern.FindStringSubmatch(anchorTag)
		if match == nil {
			continue
		}

		appendLinkReference(refsByURL, firstString(match[1], match[2], match[3]), ref, baseURL)
	}
}

func appendArticleLinkField(refsByURL map[string][]linkReference, value interface{}, ref linkReference, baseURL string) {
	switch typedValue := value.(type) {
	case string:
		appendLinkReference(refsByURL, typedValue, ref, baseURL)
	case map[string]interface{}:
		appendLinkReference(refsByURL, firstString(
			stringValue(typedValue["url"]),
			stringValue(typedValue["href"]),
			stringValue(typedValue["link"]),
		), ref, baseURL)

		if id := stringValue(typedValue["id"]); id != "" {
			appendLinkReference(refsByURL, "/articles/"+id, ref, baseURL)
		}
	}
}

func collectArticleLinks(article map[string]interface{}, baseURL string) map[string][]linkReference {
	refsByURL := map[string][]linkReference{}
	articleID := stringValue(article["id"])
	articleTitle := stringValue(article["title"])

	blockGroups := []string{"introduction_blocks", "content_blocks"}
	textFields := []string{
		"rich_text",
		"custom_html",
		"bubble_text",
		"box_merit",
		"box_demerit",
		"box_point",
		"box_common",
	}

	for _, group := range blockGroups {
		blocks, ok := article[group].([]interface{})
		if !ok {
			continue
		}

		for blockIndex, block := range blocks {
			blockMap, ok := block.(map[string]interface{})
			if !ok {
				continue
			}

			for _, field := range textFields {
				text := stringValue(blockMap[field])
				if text == "" {
					continue
				}

				extractTextLinks(refsByURL, text, linkReference{
					ArticleID:    articleID,
					ArticleTitle: articleTitle,
					Field:        fmt.Sprintf("%s[%d].%s", group, blockIndex, field),
				}, baseURL)
			}

			appendArticleLinkField(refsByURL, blockMap["article_link"], linkReference{
				ArticleID:    articleID,
				ArticleTitle: articleTitle,
				Field:        fmt.Sprintf("%s[%d].article_link", group, blockIndex),
			}, baseURL)
		}
	}

	return refsByURL
}

func mergeLinkReferences(target, source map[string][]linkReference) {
	for linkURL, refs := range source {
		for _, ref := range refs {
			appendLinkReference(target, linkURL, ref, "")
		}
	}
}

func collectArticlesLinks(articles []map[string]interface{}, baseURL string) map[string][]linkReference {
	refsByURL := map[string][]linkReference{}

	for _, article := range articles {
		mergeLinkReferences(refsByURL, collectArticleLinks(article, baseURL))
	}

	return refsByURL
}

func isBlockedLinkCheckerHostname(host string) bool {
	normalizedHost := strings.TrimSuffix(strings.ToLower(strings.TrimSpace(host)), ".")
	return normalizedHost == "localhost" || strings.HasSuffix(normalizedHost, ".localhost")
}

func isBlockedLinkCheckerIP(ip net.IP) bool {
	addr, ok := netip.AddrFromSlice(ip)
	if !ok {
		return true
	}

	addr = addr.Unmap()
	for _, prefix := range linkCheckerBlockedIPPrefixes {
		if prefix.Contains(addr) {
			return true
		}
	}

	return addr.IsUnspecified() ||
		addr.IsLoopback() ||
		addr.IsPrivate() ||
		addr.IsLinkLocalUnicast() ||
		addr.IsMulticast()
}

func validateLinkCheckerTarget(ctx context.Context, linkURL string) error {
	parsedURL, err := url.Parse(linkURL)
	if err != nil {
		return err
	}

	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		return fmt.Errorf("unsupported link scheme %q", parsedURL.Scheme)
	}

	host := parsedURL.Hostname()
	if host == "" {
		return errors.New("link target host is missing")
	}

	if isBlockedLinkCheckerHostname(host) {
		return fmt.Errorf("blocked link target host %q", host)
	}

	if ip := net.ParseIP(host); ip != nil {
		if isBlockedLinkCheckerIP(ip) {
			return fmt.Errorf("blocked link target IP %q", host)
		}
		return nil
	}

	if linkCheckerLookupIPAddr == nil {
		return errors.New("link checker resolver is unavailable")
	}

	ips, err := linkCheckerLookupIPAddr(ctx, host)
	if err != nil {
		return fmt.Errorf("resolve link target %q: %w", host, err)
	}
	if len(ips) == 0 {
		return fmt.Errorf("resolve link target %q: no addresses", host)
	}

	for _, ip := range ips {
		if isBlockedLinkCheckerIP(ip.IP) {
			return fmt.Errorf("blocked link target IP %q for host %q", ip.IP.String(), host)
		}
	}

	return nil
}

func linkCheckerDoWithoutRedirects(req *http.Request) (*http.Response, error) {
	baseClient := http.DefaultClient
	if linkCheckerHTTPClient != nil {
		baseClient = linkCheckerHTTPClient
	}

	copiedClient := *baseClient
	copiedClient.CheckRedirect = func(req *http.Request, via []*http.Request) error {
		return http.ErrUseLastResponse
	}

	return copiedClient.Do(req)
}

func isLinkCheckerRedirectStatus(statusCode int) bool {
	switch statusCode {
	case http.StatusMovedPermanently,
		http.StatusFound,
		http.StatusSeeOther,
		http.StatusTemporaryRedirect,
		http.StatusPermanentRedirect:
		return true
	default:
		return false
	}
}

func resolveLinkCheckerRedirectURL(currentURL, location string) (string, error) {
	parsedCurrentURL, err := url.Parse(currentURL)
	if err != nil {
		return "", err
	}

	parsedLocation, err := url.Parse(strings.TrimSpace(location))
	if err != nil {
		return "", err
	}

	return parsedCurrentURL.ResolveReference(parsedLocation).String(), nil
}

func doLinkCheckerRequest(ctx context.Context, method, linkURL string) (int, error) {
	currentURL := linkURL

	for redirectCount := 0; ; redirectCount++ {
		if err := validateLinkCheckerTarget(ctx, currentURL); err != nil {
			return 0, err
		}

		req, err := http.NewRequestWithContext(ctx, method, currentURL, nil)
		if err != nil {
			return 0, err
		}

		req.Header.Set("User-Agent", "NextBlogApp-LinkChecker/1.0")
		req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")

		resp, err := linkCheckerDoWithoutRedirects(req)
		if err != nil {
			return 0, err
		}

		statusCode := resp.StatusCode
		location := resp.Header.Get("Location")
		closeResponseBody(resp)

		if !isLinkCheckerRedirectStatus(statusCode) || strings.TrimSpace(location) == "" {
			return statusCode, nil
		}

		if redirectCount >= linkCheckerMaxRedirects {
			return 0, fmt.Errorf("too many redirects")
		}

		currentURL, err = resolveLinkCheckerRedirectURL(currentURL, location)
		if err != nil {
			return 0, err
		}
	}

}

func isBrokenStatus(statusCode int) bool {
	return statusCode >= http.StatusBadRequest
}

func checkSingleLink(ctx context.Context, linkURL string) (int, string, bool) {
	requestContext, cancel := context.WithTimeout(ctx, linkCheckerRequestTimeout)
	defer cancel()

	statusCode, err := doLinkCheckerRequest(requestContext, http.MethodHead, linkURL)
	if err != nil ||
		statusCode == http.StatusForbidden ||
		statusCode == http.StatusMethodNotAllowed ||
		isBrokenStatus(statusCode) {
		statusCode, err = doLinkCheckerRequest(requestContext, http.MethodGet, linkURL)
	}

	if err != nil {
		return 0, err.Error(), true
	}

	return statusCode, "", isBrokenStatus(statusCode)
}

func checkLinks(ctx context.Context, refsByURL map[string][]linkReference) []linkCheckResult {
	urls := make([]string, 0, len(refsByURL))
	for linkURL := range refsByURL {
		urls = append(urls, linkURL)
	}
	sort.Strings(urls)

	if len(urls) == 0 {
		return []linkCheckResult{}
	}

	workerCount := linkCheckerMaxConcurrency
	if len(urls) < workerCount {
		workerCount = len(urls)
	}

	jobs := make(chan string)
	results := make(chan linkCheckResult, len(urls))
	var waitGroup sync.WaitGroup

	for i := 0; i < workerCount; i++ {
		waitGroup.Add(1)
		go func() {
			defer waitGroup.Done()

			for {
				select {
				case <-ctx.Done():
					return
				case linkURL, ok := <-jobs:
					if !ok {
						return
					}

					statusCode, errorMessage, broken := checkSingleLink(ctx, linkURL)
					result := linkCheckResult{
						URL:        linkURL,
						StatusCode: statusCode,
						Error:      errorMessage,
						References: refsByURL[linkURL],
						broken:     broken,
					}

					select {
					case results <- result:
					case <-ctx.Done():
						return
					}
				}
			}
		}()
	}

	go func() {
		defer close(jobs)
		for _, linkURL := range urls {
			select {
			case jobs <- linkURL:
			case <-ctx.Done():
				return
			}
		}
	}()

	waitGroup.Wait()
	close(results)

	checkedLinks := make([]linkCheckResult, 0, len(urls))
	for result := range results {
		checkedLinks = append(checkedLinks, result)
	}

	sort.Slice(checkedLinks, func(i, j int) bool {
		return checkedLinks[i].URL < checkedLinks[j].URL
	})

	return checkedLinks
}

func brokenLinks(results []linkCheckResult) []linkCheckResult {
	links := []linkCheckResult{}

	for _, result := range results {
		if result.broken {
			result.broken = false
			links = append(links, result)
		}
	}

	return links
}

func sendLinkCheckerSMTPMail(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
	host, _, err := net.SplitHostPort(addr)
	if err != nil {
		return err
	}

	dialer := net.Dialer{Timeout: linkCheckerSMTPTimeout}
	conn, err := dialer.Dial("tcp", addr)
	if err != nil {
		return err
	}
	defer conn.Close()

	if err := conn.SetDeadline(time.Now().Add(linkCheckerSMTPTimeout)); err != nil {
		return err
	}

	client, err := smtp.NewClient(conn, host)
	if err != nil {
		return err
	}
	defer client.Close()

	if ok, _ := client.Extension("STARTTLS"); ok {
		if err := client.StartTLS(&tls.Config{ServerName: host, MinVersion: tls.VersionTLS12}); err != nil {
			return err
		}
	}

	if auth != nil {
		if ok, _ := client.Extension("AUTH"); !ok {
			return errors.New("smtp: server doesn't support AUTH")
		}
		if err := client.Auth(auth); err != nil {
			return err
		}
	}

	if err := client.Mail(from); err != nil {
		return err
	}

	for _, recipient := range to {
		if err := client.Rcpt(recipient); err != nil {
			return err
		}
	}

	writer, err := client.Data()
	if err != nil {
		return err
	}

	if _, err := writer.Write(msg); err != nil {
		_ = writer.Close()
		return err
	}

	if err := writer.Close(); err != nil {
		return err
	}

	return client.Quit()
}

func notificationConfig() (string, string, string, string, error) {
	to := strings.TrimSpace(os.Getenv("EMAIL_TO"))
	from := strings.TrimSpace(os.Getenv("EMAIL_FROM"))
	smtpUser := strings.TrimSpace(os.Getenv("SMTP_USER"))
	smtpPass := strings.TrimSpace(os.Getenv("SMTP_PASS"))

	if to == "" || from == "" || smtpUser == "" || smtpPass == "" {
		return "", "", "", "", fmt.Errorf("EMAIL_TO, EMAIL_FROM, SMTP_USER, and SMTP_PASS environment variables are required")
	}

	toAddress, err := mail.ParseAddress(to)
	if err != nil {
		return "", "", "", "", fmt.Errorf("invalid notification recipient: %w", err)
	}

	fromAddress, err := mail.ParseAddress(from)
	if err != nil {
		return "", "", "", "", fmt.Errorf("invalid notification sender: %w", err)
	}

	return toAddress.Address, fromAddress.Address, smtpUser, smtpPass, nil
}

func linkCheckerIssueLabel(link linkCheckResult) string {
	if link.Error != "" {
		return link.Error
	}

	return fmt.Sprintf("HTTP %d", link.StatusCode)
}

func writeLinkCheckerEmailBody(builder *strings.Builder, links []linkCheckResult) {
	builder.WriteString("<p>記事コンテンツ内でリンク切れの可能性があるURLを検出しました。</p>")
	builder.WriteString("<ul>")

	for index, link := range links {
		if index >= linkCheckerEmailPreviewLimit {
			builder.WriteString(fmt.Sprintf("<li>ほか %d 件</li>", len(links)-linkCheckerEmailPreviewLimit))
			break
		}

		escapedURL := html.EscapeString(link.URL)
		builder.WriteString("<li style=\"margin-bottom:16px;\">")
		builder.WriteString(fmt.Sprintf("<a href=\"%s\">%s</a><br>", escapedURL, escapedURL))
		builder.WriteString(fmt.Sprintf("状態: %s<br>", html.EscapeString(linkCheckerIssueLabel(link))))
		builder.WriteString("参照元:<ul>")
		for _, ref := range link.References {
			label := fmt.Sprintf("%s %s", ref.ArticleID, ref.Field)
			if ref.ArticleTitle != "" {
				label = fmt.Sprintf("%s (%s) %s", ref.ArticleID, ref.ArticleTitle, ref.Field)
			}
			builder.WriteString(fmt.Sprintf("<li>%s</li>", html.EscapeString(strings.TrimSpace(label))))
		}
		builder.WriteString("</ul></li>")
	}

	builder.WriteString("</ul>")
}

func sendLinkCheckerNotification(links []linkCheckResult) error {
	to, from, smtpUser, smtpPass, err := notificationConfig()
	if err != nil {
		return err
	}

	siteTitle := strings.TrimSpace(os.Getenv("BASE_TITLE"))
	subject := "リンク切れを検出しました"
	if siteTitle != "" {
		subject = siteTitle + " - " + subject
	}

	fromAddress := mail.Address{Name: siteTitle, Address: from}
	toAddress := mail.Address{Address: to}

	var builder strings.Builder
	builder.WriteString(fmt.Sprintf("From: %s\r\n", fromAddress.String()))
	builder.WriteString(fmt.Sprintf("To: %s\r\n", toAddress.String()))
	builder.WriteString(fmt.Sprintf("Subject: %s\r\n", mime.QEncoding.Encode("UTF-8", subject)))
	builder.WriteString("MIME-Version: 1.0\r\n")
	builder.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
	builder.WriteString("\r\n")
	writeLinkCheckerEmailBody(&builder, links)

	auth := smtp.PlainAuth("", smtpUser, smtpPass, "smtp.gmail.com")
	return linkCheckerSMTPSend("smtp.gmail.com:587", auth, from, []string{to}, []byte(builder.String()))
}

func LinkCheckerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeLinkCheckerJSON(w, http.StatusMethodNotAllowed, map[string]string{"message": "Method Not Allowed"})
		return
	}

	cronSecret := os.Getenv("CRON_SECRET")
	if cronSecret == "" {
		writeLinkCheckerJSON(w, http.StatusInternalServerError, map[string]string{"message": "CRON_SECRET is missing"})
		return
	}

	if r.Header.Get("Authorization") != "Bearer "+cronSecret {
		writeLinkCheckerJSON(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
		return
	}

	serviceDomain := os.Getenv("MICROCMS_SERVICE_DOMAIN")
	apiKey := os.Getenv("MICROCMS_API_KEY")
	if serviceDomain == "" || apiKey == "" {
		writeLinkCheckerJSON(w, http.StatusInternalServerError, map[string]string{"message": "microCMS environment variables missing"})
		return
	}

	runContext, cancel := context.WithTimeout(r.Context(), linkCheckerRunTimeout)
	defer cancel()

	articles, err := fetchMicroCMSLinkCheckerArticles(runContext, serviceDomain, apiKey)
	if err != nil {
		if runContext.Err() != nil {
			log.Printf("Link checker timed out while fetching microCMS articles: %v", runContext.Err())
			writeLinkCheckerJSON(w, http.StatusGatewayTimeout, map[string]string{"message": "link checker timed out"})
			return
		}
		log.Printf("Failed to fetch microCMS articles for link checker: %v", err)
		writeLinkCheckerJSON(w, http.StatusBadGateway, map[string]string{"message": "failed to fetch articles"})
		return
	}

	refsByURL := collectArticlesLinks(articles, linkCheckerBaseURL())
	checkedLinks := checkLinks(runContext, refsByURL)
	if runContext.Err() != nil {
		log.Printf("Link checker timed out after checking %d links: %v", len(checkedLinks), runContext.Err())
		writeLinkCheckerJSON(w, http.StatusGatewayTimeout, map[string]interface{}{
			"message":      "link checker timed out",
			"checkedCount": len(checkedLinks),
		})
		return
	}

	links := brokenLinks(checkedLinks)
	notified := false

	if len(links) > 0 {
		if err := sendLinkCheckerNotification(links); err != nil {
			log.Printf("Failed to send link checker notification: %v", err)
			writeLinkCheckerJSON(w, http.StatusInternalServerError, map[string]string{"message": "failed to send notification"})
			return
		}
		notified = true
	}

	writeLinkCheckerJSON(w, http.StatusOK, linkCheckerResponse{
		Success:      true,
		CheckedCount: len(checkedLinks),
		BrokenCount:  len(links),
		Notified:     notified,
		BrokenLinks:  links,
	})
}
