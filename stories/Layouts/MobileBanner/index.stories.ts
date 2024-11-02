import type { Meta, StoryObj } from '@storybook/react';
import MobileBanner from '@/components/Layouts/MobileBanner';

const meta: Meta<typeof MobileBanner> = {
  title: 'Layouts/MobileBanner',
  component: MobileBanner,
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
