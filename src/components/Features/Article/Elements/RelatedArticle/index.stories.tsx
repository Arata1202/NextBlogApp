import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RelatedArticle from '.';
import { articleFixture } from '@/stories/articleFixtures';

const meta = {
  title: 'Content/Related Articles',
  component: RelatedArticle,
  args: {
    relatedArticles: [
      articleFixture,
      { ...articleFixture, id: 'storybook-related-2', title: 'あわせて確認したい関連記事' },
    ],
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RelatedArticle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
