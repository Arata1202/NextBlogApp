import type { Meta, StoryObj } from '@storybook/react';
import Archive from '@/components/Sidebars/Elements/Archive';

const meta: Meta<typeof Archive> = {
  title: 'Sidebars/Elements/Archive',
  component: Archive,
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
