import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Share from '.';
import { articleFixture } from '@/stories/articleFixtures';

const meta = {
  title: 'Content/Share',
  component: Share,
  tags: ['autodocs'],
} satisfies Meta<typeof Share>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { data: articleFixture } };
