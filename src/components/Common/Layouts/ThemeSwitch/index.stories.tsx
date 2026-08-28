import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent } from 'storybook/test';
import ThemeSwitch from '.';

const meta = {
  title: 'Navigation/Theme Switch',
  component: ThemeSwitch,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const switchToDarkButton = await canvas.findByRole('button', {
      name: 'ダークテーマに切り替え',
    });

    await userEvent.click(switchToDarkButton);

    await expect(
      canvas.getByRole('button', { name: 'ライトテーマに切り替え' }),
    ).toBeInTheDocument();
  },
};
