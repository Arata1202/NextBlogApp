import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Markdown from '.';

const content = `## 固定ページの見出し

本文には[内部リンク](/profile)と[外部リンク](https://example.com)を含められます。

### リスト

- ひとつ目の項目
- ふたつ目の項目

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

export const FixedPageContent: Story = {
  args: { content, headingIds: ['page-heading', 'list', 'code'] },
};
