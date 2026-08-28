import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ArticleList from '.';
import { articleFixture, unifiedArticleFixture } from '@/stories/articleFixtures';

const createdAt = '2026-08-01T09:00:00.000Z';
const tags = [
  {
    id: 'storybook-tag',
    name: 'Next.js',
    createdAt,
    updatedAt: createdAt,
    publishedAt: createdAt,
    revisedAt: createdAt,
  },
];
const archiveList = [{ year: '2026', month: '8' }];

const meta = {
  title: 'Content/Article List',
  component: ArticleList,
  args: { tags, archiveList },
  tags: ['autodocs'],
} satisfies Meta<typeof ArticleList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Articles: Story = {
  args: {
    articles: [
      articleFixture,
      { ...articleFixture, id: 'storybook-article-2', title: 'StorybookでUIを確認する方法' },
    ],
  },
};

export const MixedSources: Story = {
  args: {
    articles: [],
    mixedArticles: [
      unifiedArticleFixture,
      {
        ...unifiedArticleFixture,
        id: 'storybook-zenn',
        source: 'zenn',
        url: 'https://zenn.dev/example/articles/storybook',
        title: 'Next.js App Routerの設計で意識したこと',
        description:
          'Zennから取得した外部記事です。ブログ記事とは異なる配信元とリンク先を持つ一覧表示を確認します。',
        publishedAt: '2026-07-20T09:00:00.000Z',
        updatedAt: undefined,
        thumbnail: undefined,
        thumbnailUrl: '/images/thumbnail/7.webp',
        isSponsored: false,
      },
    ],
  },
};

export const Loading: Story = { args: { articles: [], isLoading: true } };
export const Empty: Story = { args: { articles: [], emptyMessage: '該当する記事はありません' } };
