import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import CustomHtml from '.';
import '@/styles/plugin.css';

const articleHtml = `
  <p>カスタムHTMLで挿入される記事本文の表示例です。<strong>強調</strong>や<a href="https://example.com">外部リンク</a>を含みます。</p>
  <h2>カスタムHTMLの見出し</h2>
  <p>本文の余白、行間、リンク色などが本番の記事画面と同じことを確認します。</p>
  <div data-filename="app.ts">
    <pre><code>export function greeting(name: string) {
  return \`こんにちは、\${name}さん\`;
}</code></pre>
  </div>
  <h3>表示できる要素</h3>
  <ul>
    <li>箇条書き</li>
    <li>コードブロック</li>
    <li>引用とテーブル</li>
  </ul>
  <blockquote><p>引用文の背景、余白、アイコンを確認します。</p></blockquote>
  <table>
    <thead><tr><th>項目</th><th>内容</th></tr></thead>
    <tbody><tr><td>表示元</td><td>カスタムHTML</td></tr></tbody>
  </table>
`;

const meta = {
  title: 'Content/Article Plugins/Custom HTML',
  component: CustomHtml,
  args: { html: articleHtml },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-4xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: '記事本文へ挿入される、サニタイズ済みカスタムHTMLの本番相当表示を確認します。',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomHtml>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleContent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const externalLink = canvas.getByRole('link', { name: '外部リンク' });
    const wrapButton = await canvas.findByRole('button', { name: 'コードを折り返す' });

    await waitFor(() => {
      expect(externalLink).toHaveAttribute('target', '_blank');
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    await userEvent.click(wrapButton);
    await expect(wrapButton).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
