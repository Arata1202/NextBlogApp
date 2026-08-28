import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ArticleCard from '.';
import { articleFixture, sponsoredArticleFixture } from '@/stories/articleFixtures';

const meta = {
  title: 'Content/Article Card',
  component: ArticleCard,
  decorators: [
    (Story) => (
      <ul className="mx-auto max-w-7xl">
        <Story />
      </ul>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { article: articleFixture } };

export const Sponsored: Story = { args: { article: sponsoredArticleFixture } };

export const WithoutImage: Story = {
  args: {
    article: {
      ...articleFixture,
      id: 'storybook-without-image',
      thumbnail: { url: '', width: 1200, height: 630 },
    },
  },
};

export const LongContent: Story = {
  args: {
    article: {
      ...articleFixture,
      id: 'storybook-long-content',
      title:
        'とても長い記事タイトルがカードの横幅を超えそうな場合でもレイアウトが崩れずに表示されることを確認するStory',
      description:
        '説明文も長くなった場合の折り返しを確認します。単語やURLが長いケースを含め、カードから内容がはみ出さないことが重要です。https://example.com/very-long-path-for-layout-verification',
    },
  },
};
