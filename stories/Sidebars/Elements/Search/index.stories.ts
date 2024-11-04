import type { Meta, StoryObj } from '@storybook/react';
import Search from '@/components/Sidebars/Elements/Search';

const meta: Meta<typeof Search> = {
  title: 'Sidebars/Elements/Search',
  component: Search,
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
