import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import Header from '.';

const meta = {
  title: 'Layout/Header',
  component: Header,
  decorators: [
    (Story) => (
      <div className="min-h-48 pt-24">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'メニューを開く' })).toBeVisible();
  },
};
