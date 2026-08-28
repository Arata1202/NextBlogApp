import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
