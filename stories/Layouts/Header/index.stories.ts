import type { Meta, StoryObj } from '@storybook/react';
import Header from '@/components/Layouts/Header';

const meta: Meta<typeof Header> = {
  title: 'Layouts/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isDarkMode: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isDarkMode: false,
  },
};
