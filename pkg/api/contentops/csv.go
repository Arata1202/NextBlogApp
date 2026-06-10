package contentops

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"strings"
)

func microCMSBackupCSVHeader() []string {
	return []string{
		"コンテンツID\n※空欄で構いません。特定の値を設定したい場合に入力してください。",
		"title",
		"description",
		"categories",
		"tags",
		"thumbnail",
		"introduction_blocks",
		"content_blocks",
		"related_articles",
	}
}

func microCMSReferenceID(value interface{}) string {
	switch typedValue := value.(type) {
	case string:
		return strings.TrimSpace(typedValue)
	case map[string]interface{}:
		return microCMSBackupFirstString(
			microCMSBackupStringValue(typedValue["id"]),
			microCMSBackupStringValue(typedValue["contentId"]),
		)
	default:
		return ""
	}
}

func microCMSReferenceIDsCSVValue(value interface{}) string {
	switch typedValue := value.(type) {
	case nil:
		return ""
	case []interface{}:
		ids := make([]string, 0, len(typedValue))
		for _, item := range typedValue {
			if id := microCMSReferenceID(item); id != "" {
				ids = append(ids, id)
			}
		}
		return strings.Join(ids, ",")
	default:
		return microCMSReferenceID(typedValue)
	}
}

func microCMSImageURLValue(value interface{}) string {
	switch typedValue := value.(type) {
	case string:
		return strings.TrimSpace(typedValue)
	case map[string]interface{}:
		return microCMSBackupFirstString(
			microCMSBackupStringValue(typedValue["url"]),
			microCMSBackupStringValue(typedValue["src"]),
		)
	default:
		return ""
	}
}

func microCMSJSONCSVValue(value interface{}) (string, error) {
	if value == nil {
		return "", nil
	}

	if text, ok := value.(string); ok {
		return strings.TrimSpace(text), nil
	}

	jsonValue, err := json.Marshal(value)
	if err != nil {
		return "", err
	}

	return string(jsonValue), nil
}

func microCMSBackupCSVRow(article map[string]interface{}) ([]string, error) {
	introductionBlocks, err := microCMSJSONCSVValue(article["introduction_blocks"])
	if err != nil {
		return nil, err
	}

	contentBlocks, err := microCMSJSONCSVValue(article["content_blocks"])
	if err != nil {
		return nil, err
	}

	relatedArticles, err := microCMSJSONCSVValue(article["related_articles"])
	if err != nil {
		return nil, err
	}

	return []string{
		microCMSBackupStringValue(article["id"]),
		microCMSBackupStringValue(article["title"]),
		microCMSBackupStringValue(article["description"]),
		microCMSReferenceIDsCSVValue(article["categories"]),
		microCMSReferenceIDsCSVValue(article["tags"]),
		microCMSImageURLValue(article["thumbnail"]),
		introductionBlocks,
		contentBlocks,
		relatedArticles,
	}, nil
}

func writeMicroCMSBackupCSV(writer io.Writer, articles []map[string]interface{}) error {
	csvWriter := csv.NewWriter(writer)

	if err := csvWriter.Write(microCMSBackupCSVHeader()); err != nil {
		return err
	}

	for _, article := range articles {
		row, err := microCMSBackupCSVRow(article)
		if err != nil {
			return err
		}
		if err := csvWriter.Write(row); err != nil {
			return err
		}
	}

	csvWriter.Flush()
	return csvWriter.Error()
}
