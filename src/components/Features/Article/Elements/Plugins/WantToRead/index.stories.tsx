import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WantToRead from '.';
import { articleFixture } from '@/stories/articleFixtures';

const meta = {
  title: 'Content/Article Plugins/Want To Read',
  component: WantToRead,
  args: { block: { article_link: articleFixture } },
  tags: ['autodocs'],
} satisfies Meta<typeof WantToRead>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
