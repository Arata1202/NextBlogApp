package linkchecker

import (
	"reflect"
	"strings"
	"testing"
)

func TestCollectArticleLinks(t *testing.T) {
	nonLinkedExamplesHTML := strings.Join([]string{
		`<p>Example attribute: href="https://not-linked.example/path"</p>`,
		`<pre><code>&lt;a href=&quot;https://escaped-code.example/path&quot;&gt;sample&lt;/a&gt;</code></pre>`,
		`<pre><code><a href="https://raw-code.example/path">sample</a></code></pre>`,
		`<p><code><a href="https://inline-code.example/path">sample</a></code></p>`,
		`<div class="iframely-embed"><a data-iframely-url href="https://iframely.example/embed"></a></div>`,
	}, "")

	refsByURL := collectArticleLinks(map[string]interface{}{
		"id":    "article-a",
		"title": "Article A",
		"introduction_blocks": []interface{}{
			map[string]interface{}{
				"rich_text": `<p><a href="https://external.example/a?x=1&amp;y=2#heading">External</a></p>`,
			},
		},
		"content_blocks": []interface{}{
			map[string]interface{}{
				"custom_html":  `<a href='/articles/local#section'>Local</a> [Markdown](https://markdown.example/path) <a href="mailto:user@example.com">mail</a>`,
				"article_link": map[string]interface{}{"id": "related-article"},
			},
			map[string]interface{}{
				"rich_text": nonLinkedExamplesHTML,
				"box_point": `<a href="javascript:alert(1)">ignored</a><a href="#local">anchor</a>`,
			},
		},
	}, "https://site.example")

	gotURLs := make([]string, 0, len(refsByURL))
	for linkURL := range refsByURL {
		gotURLs = append(gotURLs, linkURL)
	}

	wantURLs := []string{
		"https://external.example/a?x=1&y=2",
		"https://iframely.example/embed",
		"https://site.example/articles/local",
		"https://site.example/articles/related-article",
	}

	if !reflect.DeepEqual(sortStrings(gotURLs), wantURLs) {
		t.Fatalf("urls = %v, want %v", sortStrings(gotURLs), wantURLs)
	}

	if refsByURL["https://external.example/a?x=1&y=2"][0].Field != "introduction_blocks[0].rich_text" {
		t.Fatalf("unexpected reference = %#v", refsByURL["https://external.example/a?x=1&y=2"][0])
	}
}
