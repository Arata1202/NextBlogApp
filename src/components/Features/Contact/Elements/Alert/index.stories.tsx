import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import Alert from '.';

const meta = {
  title: 'Feedback/Contact Alert',
  component: Alert,
  args: {
    onClose: fn(),
    show: true,
    title: 'お問い合わせありがとうございます',
    description: '正常に処理が完了しました。',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Error: Story = {
  args: {
    variant: 'error',
    title: '送信に失敗しました',
    description: '時間をおいて再度お試しください。',
  },
};

export const CloseInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: '通知を閉じる' }));
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};
