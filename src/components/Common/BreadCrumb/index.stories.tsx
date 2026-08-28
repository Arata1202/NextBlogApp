import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BreadCrumb from '.';
import { articleFixture } from '@/stories/articleFixtures';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: BreadCrumb,
  tags: ['autodocs'],
} satisfies Meta<typeof BreadCrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Article: Story = { args: { page: { type: 'article', article: articleFixture } } };

export const SearchResult: Story = {
  args: { page: { type: 'search', searchKeyword: 'Next.js Storybook' } },
};

export const Loading: Story = {
  args: { page: { type: 'search' }, isLoading: true },
};

export const LongTitle: Story = {
  args: {
    page: {
      type: 'article',
      article: {
        ...articleFixture,
        title: '画面幅が狭い場合に折り返される、とても長い記事タイトルの表示確認',
      },
    },
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
