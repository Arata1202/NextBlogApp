package linkchecker

import (
	"fmt"
	"html"
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
