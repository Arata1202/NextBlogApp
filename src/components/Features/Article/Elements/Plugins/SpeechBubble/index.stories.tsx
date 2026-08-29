import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SpeechBubble from '.';

const meta = {
  title: 'Content/Article Plugins/Speech Bubble',
  component: SpeechBubble,
  args: {
    block: {
      bubble_image: { url: '/images/thumbnail/7.webp', width: 150, height: 150 },
      bubble_text: 'ここが記事の大切なポイントです。',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SpeechBubble>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Left: Story = {};
export const Right: Story = { args: { block: { ...meta.args.block, bubble_isRight: true } } };
export const LongText: Story = {
  args: {
    block: {
      ...meta.args.block,
      bubble_text:
        '文章が長い場合でも、画像と吹き出しの位置関係を保ちながら自然に折り返されることを確認します。スマートフォンの画面幅でも内容がはみ出さないことが重要です。',
    },
  },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
