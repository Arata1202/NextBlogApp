import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ArticleList from '.';
import { articleFixture } from '@/stories/articleFixtures';

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

export const Loading: Story = { args: { articles: [], isLoading: true } };
export const Empty: Story = { args: { articles: [], emptyMessage: '該当する記事はありません' } };
