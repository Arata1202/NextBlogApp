package search

import (
	"html"
	"strings"
)

func stripSearchHTML(value string) string {
	strippedText := htmlTagPattern.ReplaceAllString(html.UnescapeString(value), " ")
	return strings.Join(strings.Fields(strippedText), " ")
}

func searchStringValue(value interface{}) string {
	text, ok := value.(string)
	if !ok {
		return ""
	}

	return strings.TrimSpace(text)
}

func normalizedSearchText(value string) string {
	return strings.ToLower(stripSearchHTML(value))
}

func appendSearchText(builder *strings.Builder, value interface{}) {
	text := searchStringValue(value)
	if text == "" {
		return
	}

	builder.WriteString(" ")
	builder.WriteString(stripSearchHTML(text))
}

func appendBlockSearchText(builder *strings.Builder, value interface{}) {
	blocks, ok := value.([]interface{})
	if !ok {
		return
	}

	targetFields := []string{
		"rich_text",
		"custom_html",
		"bubble_text",
		"box_merit",
		"box_demerit",
		"box_point",
		"box_common",
	}

	for _, block := range blocks {
		blockMap, ok := block.(map[string]interface{})
		if !ok {
			continue
		}

		for _, field := range targetFields {
			appendSearchText(builder, blockMap[field])
		}
	}
}

func blockSearchText(value interface{}) string {
	var builder strings.Builder
	appendBlockSearchText(&builder, value)
	return normalizedSearchText(builder.String())
}

func articleSearchText(article map[string]interface{}) string {
	var builder strings.Builder

	appendSearchText(&builder, article["title"])
	appendSearchText(&builder, article["description"])
	appendSearchText(&builder, article[searchContentField])
	appendBlockSearchText(&builder, article["introduction_blocks"])
	appendBlockSearchText(&builder, article["content_blocks"])

	return strings.ToLower(builder.String())
}

func searchTerms(query string) []string {
	return strings.Fields(normalizedSearchText(query))
}

func truncateSearchText(text string, maxLength int) string {
	text = strings.TrimSpace(text)
	if maxLength <= 0 {
		return ""
	}

	runes := []rune(text)
	if len(runes) <= maxLength {
		return text
	}

	if maxLength <= 3 {
		return string(runes[:maxLength])
	}

	return string(runes[:maxLength-3]) + "..."
}

func articleSearchScore(article map[string]interface{}, terms []string) int {
	if len(terms) == 0 {
		return 0
	}

	searchText := articleSearchText(article)
	for _, term := range terms {
		if !strings.Contains(searchText, term) {
			return 0
		}
	}

	title := normalizedSearchText(searchStringValue(article["title"]))
	description := normalizedSearchText(searchStringValue(article["description"]))
	body := normalizedSearchText(searchStringValue(article[searchContentField])) +
		" " + blockSearchText(article["introduction_blocks"]) +
		" " + blockSearchText(article["content_blocks"])
	phrase := strings.Join(terms, " ")

	score := 0
	if title == phrase {
		score += 120
	}
	if strings.Contains(title, phrase) {
		score += 50
	}
	if strings.Contains(description, phrase) {
		score += 20
	}
	if strings.Contains(body, phrase) {
		score += 8
	}

	for _, term := range terms {
		if strings.Contains(title, term) {
			score += 30
		}
		if strings.Contains(description, term) {
			score += 12
		}
		if strings.Contains(body, term) {
			score += 4
		}
	}

	return score
}

func articleMatchesSearchQuery(article map[string]interface{}, query string) bool {
	return articleSearchScore(article, searchTerms(query)) > 0
}

func filterSearchArticles(articles []map[string]interface{}, query string) []map[string]interface{} {
	matchedArticles := []map[string]interface{}{}
	terms := searchTerms(query)

	for _, article := range articles {
		score := articleSearchScore(article, terms)
		if score > 0 {
			matchedArticle := cloneSearchArticle(article)
			matchedArticle[searchScoreField] = score
			matchedArticles = append(matchedArticles, matchedArticle)
		}
	}

	return matchedArticles
}
