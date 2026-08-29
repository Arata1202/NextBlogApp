import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import CustomHtml from '.';
import '@/styles/plugin.css';

const affiliateLinkHtml = `
  <div class="easyLink-box" style="display:grid;grid-template-columns:minmax(120px,180px) 1fr;gap:20px;align-items:center;border:1px solid #d1d5db;border-radius:8px;padding:20px;">
    <div class="easyLink-img">
      <p class="easyLink-img-box" style="position:relative;margin:0;">
        <span>
          <img class="easyLink-img-pht js-item-image" src="/images/thumbnail/7.webp" alt="紹介商品の画像" style="width:100%;height:auto;">
        </span>
        <span class="waiting">
          <img class="js-item-image" data-img_src="/images/thumbnail/6.webp" alt="紹介商品の別画像" style="display:none;width:100%;height:auto;">
        </span>
        <a href="#" class="easyLink-arrow-left" style="position:absolute;left:0;top:45%;">前へ</a>
        <a href="#" class="easyLink-arrow-right" style="position:absolute;right:0;top:45%;">次へ</a>
      </p>
    </div>
    <div class="easyLink-info">
      <p style="margin:0 0 12px;font-weight:700;">もしもアフィリエイト簡単リンクの商品例</p>
      <p class="easyLink-info-maker" style="margin:0 0 16px;">販売元：サンプルストア</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        <a href="https://www.amazon.co.jp/" style="border-radius:4px;background:#ff9900;color:#111827;padding:8px 12px;text-decoration:none;">Amazonで見る</a>
        <a href="https://www.rakuten.co.jp/" style="border-radius:4px;background:#bf0000;color:#fff;padding:8px 12px;text-decoration:none;">楽天市場で見る</a>
      </div>
    </div>
  </div>
`;

const embeddedMapHtml = `
  <iframe
    src="https://www.google.com/maps?q=Tokyo&amp;output=embed"
    title="東京周辺のGoogle Map"
    width="600"
    height="450"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    style="border:0;"
  ></iframe>
`;

const meta = {
  title: 'Content/Article Plugins/Custom HTML',
  component: CustomHtml,
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
        component:
          'アフィリエイトリンクや外部埋め込みなど、記事で実際に使うカスタムHTMLを確認します。',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomHtml>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AffiliateLink: Story = {
  args: { html: affiliateLinkHtml },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const amazonLink = canvas.getByRole('link', { name: 'Amazonで見る' });
    const previousButton = await canvas.findByRole('button', { name: '前の画像を表示' });
    const nextButton = canvas.getByRole('button', { name: '次の画像を表示' });

    await waitFor(() => {
      expect(amazonLink).toHaveAttribute('target', '_blank');
      expect(amazonLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
    await expect(previousButton).toHaveAttribute('role', 'button');
    await expect(nextButton).toHaveAttribute('role', 'button');
  },
};

export const AffiliateLinkMobile: Story = {
  args: { html: affiliateLinkHtml },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};

export const EmbeddedMap: Story = {
  args: { html: embeddedMapHtml },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const map = canvas.getByTitle('東京周辺のGoogle Map');

    await expect(map).toHaveAttribute('loading', 'lazy');
    await expect(getComputedStyle(map).width).not.toBe('600px');
  },
};
