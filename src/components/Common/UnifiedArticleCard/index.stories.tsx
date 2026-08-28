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

export const Blog: Story = { args: { article: unifiedArticleFixture } };

export const Zenn: Story = {
  args: {
    article: {
      ...unifiedArticleFixture,
      id: 'storybook-zenn-article',
      title: 'Zennで公開した技術記事',
      url: 'https://zenn.dev/example/articles/storybook',
      source: 'zenn',
      thumbnail: undefined,
      thumbnailUrl: '/images/thumbnail/7.webp',
    },
  },
};

export const Sponsored: Story = {
  args: {
    article: { ...unifiedArticleFixture, id: 'storybook-unified-sponsored', isSponsored: true },
  },
};
