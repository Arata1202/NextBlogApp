import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import CustomHtml from '.';
import '@/styles/plugin.css';

const googleMapHtml = `
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
        component: '記事へ埋め込むGoogle Mapのレスポンシブ表示を確認します。',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomHtml>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GoogleMap: Story = {
  args: { html: googleMapHtml },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const map = canvas.getByTitle('東京周辺のGoogle Map');

    await expect(map).toHaveAttribute('loading', 'lazy');
    await expect(getComputedStyle(map).width).not.toBe('600px');
  },
};
