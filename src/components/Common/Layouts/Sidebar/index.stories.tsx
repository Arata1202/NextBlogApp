import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Sidebar from '.';
import { unifiedArticleFixture } from '@/stories/articleFixtures';

const createdAt = '2026-08-01T09:00:00.000Z';

const tags = ['Next.js', 'TypeScript', '個人開発'].map((name, index) => ({
  id: `tag-${index + 1}`,
  name,
  createdAt,
  updatedAt: createdAt,
  publishedAt: createdAt,
  revisedAt: createdAt,
}));

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  args: {
    tags,
    archiveList: [
      { year: '2026', month: '8' },
      { year: '2026', month: '7' },
      { year: '2025', month: '12' },
    ],
    recentArticles: [
      unifiedArticleFixture,
      {
        ...unifiedArticleFixture,
        id: 'storybook-recent-article-2',
        title: 'StorybookでUIを管理する方法',
        url: '/articles/storybook-recent-article-2',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="ml-auto max-w-sm">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
