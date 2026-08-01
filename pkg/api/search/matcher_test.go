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

func TestRankMicroCMSSearchArticlesKeepsMatchesFromOmittedFields(t *testing.T) {
	articles := []map[string]interface{}{
		{
			"id":          "body-match",
			"title":       "Unrelated title",
			"description": "Unrelated description",
		},
	}

	rankedArticles := rankMicroCMSSearchArticles(articles, "React")
	if len(rankedArticles) != 1 {
		t.Fatalf("ranked article count = %d, want 1", len(rankedArticles))
	}

	if got, ok := rankedArticles[0][searchScoreField].(int); !ok || got != 1 {
		t.Fatalf("search score = %#v, want 1", rankedArticles[0][searchScoreField])
	}
}
