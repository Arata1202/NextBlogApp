import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import Modal from '.';

const meta = {
  title: 'Feedback/Contact Modal',
  component: Modal,
  args: {
    title: 'お問い合わせを送信しますか？',
    description: '入力内容を確認して、問題がなければ送信してください。',
    confirmText: '送信する',
    cancelText: '戻る',
    show: true,
    onClose: fn(),
    onConfirm: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {};

export const Loading: Story = { args: { isLoading: true, confirmText: '送信中…' } };

export const ConfirmInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: '送信する' }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
  },
};
