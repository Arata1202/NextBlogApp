import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import UnifiedArticleCard from '.';
import { unifiedArticleFixture } from '@/stories/articleFixtures';

const meta = {
  title: 'Content/Unified Article Card',
  component: UnifiedArticleCard,
  decorators: [
    (Story) => (
      <ul className="mx-auto max-w-7xl">
        <Story />
      </ul>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof UnifiedArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Zenn: Story = {
  args: {
    article: {
      ...unifiedArticleFixture,
      id: 'storybook-zenn-article',
      title: 'Next.js App Routerの設計で意識したこと',
      description: 'Zennから取得した外部記事として、新しいタブで開くカードを確認します。',
      publishedAt: '2026-07-20T09:00:00.000Z',
      updatedAt: undefined,
      url: 'https://zenn.dev/example/articles/storybook',
      source: 'zenn',
      thumbnail: undefined,
      thumbnailUrl: '/images/thumbnail/7.webp',
      isSponsored: false,
    },
  },
};
