import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AdAlert from '.';

const meta = {
  title: 'Feedback/Advertising Alert',
  component: AdAlert,
  tags: ['autodocs'],
} satisfies Meta<typeof AdAlert>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
