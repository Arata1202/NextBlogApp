import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SitemapHtmlFeature from '.';
import { articleFixture } from '@/stories/articleFixtures';
import FixedContentContainer from '@/components/Common/Layouts/Container/FixedContentContainer';

const category = articleFixture.categories[0];
const meta = {
  title: 'Content/Sitemap',
  component: SitemapHtmlFeature,
  args: {
    articles: [
      articleFixture,
      {
        ...articleFixture,
        id: 'storybook-sitemap-2',
        title: 'Storybookでデザインシステムを管理する方法',
      },
    ],
    categories: [category],
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-4xl">
        <FixedContentContainer>
          <Story />
        </FixedContentContainer>
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SitemapHtmlFeature>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
