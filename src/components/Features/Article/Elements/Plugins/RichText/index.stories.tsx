import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RichText from '.';
import '@/styles/plugin.css';

const tableHtml = `
  <table>
    <thead>
      <tr>
        <th>オプション</th>
        <th>設定値</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ランタイム</td>
        <td>Node.js 20.x</td>
      </tr>
      <tr>
        <td>認証タイプ</td>
        <td>None</td>
      </tr>
    </tbody>
  </table>
`;

const articleHtml = `
  <h1>記事本文の見出し1</h1>
  <p>本文には<strong>強調</strong>や<a href="https://example.com">リンク</a>が含まれます。</p>
  <h2>見出し2</h2>
  <p>段落の余白と行間を確認するための文章です。</p>
  <h3>見出し3</h3>
  <ul><li>箇条書きの項目</li><li>もうひとつの項目</li></ul>
  <ol><li>番号付きの項目</li><li>次の手順</li></ol>
  <blockquote><p>引用として表示される文章です。</p></blockquote>
  <figure><img src="/images/thumbnail/7.webp" alt="記事本文のサンプル画像"><figcaption>画像のキャプション</figcaption></figure>
  <hr>
`;

const meta = {
  title: 'Content/Article Plugins/Rich Text',
  component: RichText,
  tags: ['autodocs'],
} satisfies Meta<typeof RichText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Table: Story = {
  args: { html: tableHtml },
};

export const ArticleTypography: Story = { args: { html: articleHtml } };
