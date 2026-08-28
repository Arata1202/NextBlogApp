import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import Alert from '.';

const meta = {
  title: 'Feedback/Contact Alert',
  component: Alert,
  args: {
    onClose: fn(),
    show: true,
    title: '送信しました',
    description: 'お問い合わせありがとうございます。内容を確認してご連絡します。',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Error: Story = {
  args: {
    variant: 'error',
    title: '送信できませんでした',
    description: '時間をおいて、もう一度お試しください。',
  },
};

export const CloseInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: '通知を閉じる' }));
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};
