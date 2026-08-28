import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Markdown from '.';

const content = `## 記事本文の見出し

本文には[内部リンク](/profile)と[外部リンク](https://example.com)を含められます。

### リストと引用

- ひとつ目の項目
- ふたつ目の項目

> 引用文の表示例です。

### 表

| 項目 | 内容 |
| --- | --- |
| Storybook | UIを単体で確認 |
| a11y | アクセシビリティを検査 |

### コード

~~~ts
const message = 'Hello Storybook';
console.log(message);
~~~
`;

const meta = {
  title: 'Content/Markdown',
  component: Markdown,
  tags: ['autodocs'],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleContent: Story = {
  args: { content, headingIds: ['article-heading', 'list-and-quote', 'table', 'code'] },
};
