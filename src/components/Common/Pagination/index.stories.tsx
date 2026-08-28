import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Pagination from '.';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: { totalCount: 120, basePath: '/articles' },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = { args: { current: 1 } };

export const MiddlePage: Story = { args: { current: 6 } };

export const LastPage: Story = { args: { current: 12 } };

export const QueryPagination: Story = {
  args: { current: 3, basePath: '/search', q: 'storybook', useQueryPage: true },
};
