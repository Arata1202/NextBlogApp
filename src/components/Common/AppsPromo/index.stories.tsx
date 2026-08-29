import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppsPromo from '.';

const meta = {
  title: 'Marketing/Apps Promo',
  component: AppsPromo,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AppsPromo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
