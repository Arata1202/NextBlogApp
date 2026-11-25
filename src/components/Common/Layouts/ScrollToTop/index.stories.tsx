import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import ScrollTopButton from '.';

const meta = {
  title: 'Navigation/Scroll To Top',
  component: ScrollTopButton,
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollTopButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ClickInteraction: Story = {
  beforeEach: () => {
    const originalScrollTo = window.scrollTo;
    window.scrollTo = fn();
    return () => {
      window.scrollTo = originalScrollTo;
    };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'ページ上部へ戻る' }));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: reduced ? 'auto' : 'smooth',
    });
  },
};
