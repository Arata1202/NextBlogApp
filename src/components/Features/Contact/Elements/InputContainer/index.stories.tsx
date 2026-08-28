import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import InputContainer from '.';

const registerResult = { name: 'email', onChange: fn(), onBlur: fn(), ref: fn() };
const meta = {
  title: 'Forms/Contact Input',
  component: InputContainer,
  args: { label: 'メールアドレス', name: 'email', registerResult },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof InputContainer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Input: Story = {};
export const Textarea: Story = {
  args: {
    label: 'お問い合わせ内容',
    name: 'message',
    textarea: true,
    registerResult: { ...registerResult, name: 'message' },
  },
};
export const Error: Story = {
  args: { errors: { type: 'required', message: 'メールアドレスを入力してください' } },
};
