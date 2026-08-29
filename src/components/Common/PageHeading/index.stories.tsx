import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PageHeading from '.';

const meta = {
  title: 'Navigation/Page Heading',
  component: PageHeading,
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = { args: { page: { type: 'home' } } };
export const Category: Story = {
  args: {
    page: {
      type: 'category',
      category: {
        id: 'programming',
        name: 'プログラミング',
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01',
        publishedAt: '2026-08-01',
        revisedAt: '2026-08-01',
      },
    },
  },
};
export const Search: Story = { args: { page: { type: 'search', searchKeyword: 'Next.js' } } };
export const SearchLoading: Story = { args: { page: { type: 'search' }, isLoading: true } };
