package search

import (
	"testing"
)

func TestArticleMatchesSearchQueryTargetsLegacyFields(t *testing.T) {
	article := map[string]interface{}{
		"title":       "Title text",
		"description": "Description text",
		"tags": []interface{}{
			map[string]interface{}{"name": "Ignored tag"},
		},
		"introduction_blocks": []interface{}{
			map[string]interface{}{"rich_text": "<p>Introduction body</p>"},
			map[string]interface{}{"bubble_text": "Bubble body"},
		},
		"content_blocks": []interface{}{
			map[string]interface{}{"box_point": "<strong>Point body</strong>"},
		},
	}

	for _, query := range []string{"Title", "Description", "Introduction", "Bubble", "Point"} {
		if !articleMatchesSearchQuery(article, query) {
			t.Fatalf("articleMatchesSearchQuery(%q) = false, want true", query)
		}
	}

	if articleMatchesSearchQuery(article, "Ignored") {
		t.Fatal("articleMatchesSearchQuery() matched tag text, want false")
	}
}
