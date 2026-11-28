package linkchecker

import (
	"fmt"
	"golang.org/x/net/html"
	"net/url"
	"os"
	"strings"
)

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
	rawLink = strings.TrimSpace(rawLink)
	if rawLink == "" || strings.HasPrefix(rawLink, "#") {
		return "", false
	}

	lowerLink := strings.ToLower(rawLink)
	for _, skippedPrefix := range []string{"mailto:", "tel:", "javascript:", "data:", "sms:"} {
		if strings.HasPrefix(lowerLink, skippedPrefix) {
			return "", false
		}
	}

	if strings.HasPrefix(rawLink, "//") && baseURL == "" {
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

	addNormalizedReference(refsByURL, normalizedURL, ref)
}

func addNormalizedReference(refsByURL map[string][]linkReference, normalizedURL string, ref linkReference) {
	for _, existingRef := range refsByURL[normalizedURL] {
		if existingRef == ref {
			return
		}
	}

	refsByURL[normalizedURL] = append(refsByURL[normalizedURL], ref)
}

func extractTextLinks(refsByURL map[string][]linkReference, text string, ref linkReference, baseURL string) {
	tokenizer := html.NewTokenizer(strings.NewReader(text))
	codeDepth := 0
	for {
		kind := tokenizer.Next()
		switch kind {
		case html.ErrorToken:
			return
		case html.EndTagToken:
			name, _ := tokenizer.TagName()
			if string(name) == "pre" || string(name) == "code" {
				codeDepth = max(0, codeDepth-1)
			}
		case html.StartTagToken, html.SelfClosingTagToken:
			tag := tokenizer.Token()
			if tag.Data == "pre" || tag.Data == "code" {
				if kind == html.StartTagToken {
					codeDepth++
				}
				continue
			}
			if codeDepth != 0 || tag.Data != "a" {
				continue
			}
			for _, attr := range tag.Attr {
				if attr.Key == "href" {
					appendLinkReference(refsByURL, attr.Val, ref, baseURL)
					break
				}
			}
		}
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
	if baseURL != "" && articleID != "" {
		baseURL = strings.TrimRight(baseURL, "/") + "/articles/" + url.PathEscape(articleID)
	}

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
			addNormalizedReference(target, linkURL, ref)
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
