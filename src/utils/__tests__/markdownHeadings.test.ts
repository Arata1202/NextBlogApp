import { describe, expect, it } from 'vitest';
import { extractMarkdownHeadings } from '@/utils/markdownHeadings';

describe('extractMarkdownHeadings', () => {
  it('extracts markdown headings with stable generated ids', () => {
    expect(
      extractMarkdownHeadings(
        [
          '# Ignored',
          '## 個人情報の取得方法',
          '### [Googleポリシー](https://example.com)',
          '#### `Cookie` について',
        ].join('\n\n'),
        'privacy-heading',
      ),
    ).toEqual([
      { id: 'privacy-heading-1', title: '個人情報の取得方法', level: 2 },
      { id: 'privacy-heading-2', title: 'Googleポリシー', level: 3 },
      { id: 'privacy-heading-3', title: 'Cookie について', level: 4 },
    ]);
  });
});
