import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import Modal from '.';

const meta = {
  title: 'Feedback/Contact Modal',
  component: Modal,
  args: {
    title: 'お問い合わせを送信しますか？',
    description: '送信ボタンは一度だけ押してください。送信完了まで数秒かかることがあります。',
    confirmText: '送信',
    cancelText: 'キャンセル',
    show: true,
    onClose: fn(),
    onConfirm: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {};

export const Loading: Story = { args: { isLoading: true, confirmText: '送信中...' } };

export const ConfirmInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
  },
};
