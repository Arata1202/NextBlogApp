import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemeSwitch from '.';

const meta = {
  title: 'Navigation/Theme Switch',
  component: ThemeSwitch,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
