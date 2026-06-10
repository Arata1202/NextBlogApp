package contentops

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"strings"
	"testing"
)

func TestWriteMicroCMSBackupCSV(t *testing.T) {
	articles := []map[string]interface{}{
		{
			"id":          "article-a",
			"title":       "Title A",
			"description": "Line 1\nLine 2",
			"categories": []interface{}{
				map[string]interface{}{"id": "category-a", "name": "Category A"},
				map[string]interface{}{"id": "category-b", "name": "Category B"},
			},
			"tags": []interface{}{
				map[string]interface{}{"id": "tag-a", "name": "Tag A"},
				"tag-b",
			},
			"thumbnail": map[string]interface{}{"url": "https://images.example/thumbnail.png", "width": float64(1200)},
			"introduction_blocks": []interface{}{
				map[string]interface{}{"fieldId": "rich_text", "rich_text": "<p>Intro</p>"},
			},
			"content_blocks": []interface{}{
				map[string]interface{}{"fieldId": "rich_text", "rich_text": "<p>Body</p>"},
			},
			"related_articles": []interface{}{
				map[string]interface{}{"fieldId": "article", "article": map[string]interface{}{"id": "article-b"}},
			},
		},
	}

	var buffer bytes.Buffer
	if err := writeMicroCMSBackupCSV(&buffer, articles); err != nil {
		t.Fatalf("writeMicroCMSBackupCSV() error = %v", err)
	}

	records, err := csv.NewReader(strings.NewReader(buffer.String())).ReadAll()
	if err != nil {
		t.Fatalf("csv read error = %v", err)
	}
	if len(records) != 2 {
		t.Fatalf("records length = %d, want 2", len(records))
	}

	header := records[0]
	if header[0] != "コンテンツID\n※空欄で構いません。特定の値を設定したい場合に入力してください。" {
		t.Fatalf("content id header = %q", header[0])
	}
	if strings.Join(header[1:], ",") != "title,description,categories,tags,thumbnail,introduction_blocks,content_blocks,related_articles" {
		t.Fatalf("header = %v", header)
	}

	row := records[1]
	for columnIndex, want := range []string{
		"article-a",
		"Title A",
		"Line 1\nLine 2",
		"category-a,category-b",
		"tag-a,tag-b",
		"https://images.example/thumbnail.png",
	} {
		if row[columnIndex] != want {
			t.Fatalf("row[%d] = %q, want %q", columnIndex, row[columnIndex], want)
		}
	}

	var introductionBlocks []map[string]interface{}
	if err := json.Unmarshal([]byte(row[6]), &introductionBlocks); err != nil {
		t.Fatalf("introduction_blocks json error = %v", err)
	}
	if introductionBlocks[0]["fieldId"] != "rich_text" {
		t.Fatalf("introduction_blocks = %#v", introductionBlocks)
	}

	var relatedArticles []map[string]interface{}
	if err := json.Unmarshal([]byte(row[8]), &relatedArticles); err != nil {
		t.Fatalf("related_articles json error = %v", err)
	}
	if relatedArticles[0]["fieldId"] != "article" {
		t.Fatalf("related_articles = %#v", relatedArticles)
	}
}
