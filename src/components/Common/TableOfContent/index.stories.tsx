import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TableOfContents from '.';

const headings = [
  { id: 'overview', title: '概要', level: 2 },
  { id: 'setup', title: 'セットアップ', level: 2 },
  { id: 'configuration', title: '設定', level: 3 },
  { id: 'verification', title: '動作確認', level: 2 },
];

const meta = {
  title: 'Navigation/Table of Contents',
  component: TableOfContents,
  tags: ['autodocs'],
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { headings } };

export const Sidebar: Story = { args: { headings, sidebar: true } };
