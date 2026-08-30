import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import ImageSlider from '.';

const images = [
  { url: '/images/post/1.webp', width: 1200, height: 630 },
  { url: '/images/post/2.webp', width: 1200, height: 630 },
];

const meta = {
  title: 'Content/Article Plugins/Image Slider',
  component: ImageSlider,
  args: { block: { image_slider: images }, imageAltFallback: '記事の説明画像' },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-4xl">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ImageSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleImages: Story = {};
export const SingleImage: Story = { args: { block: { image_slider: [images[0]] } } };
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone13promax', isRotated: false } },
};
export const NextImageInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: '次の画像を表示' }));
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: '2枚目の画像を表示中' })).toHaveAttribute(
        'aria-current',
        'true',
      );
    });
  },
};
