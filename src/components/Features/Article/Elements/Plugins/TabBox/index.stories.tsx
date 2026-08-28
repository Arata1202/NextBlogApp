import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TabBox from '.';

const block = {
  box_merit: '<p>導入が簡単で扱いやすい</p>',
  box_demerit: '<p>初期設定には少し時間がかかる</p>',
  box_point: '<p>設定後に必ず動作確認を行います</p>',
  box_common: '<p>利用環境によって表示が異なる場合があります</p>',
};
const meta = {
  title: 'Content/Article Plugins/Tab Box',
  component: TabBox,
  args: { block },
  tags: ['autodocs'],
} satisfies Meta<typeof TabBox>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Merit: Story = { args: { merit: true } };
export const Demerit: Story = { args: { demerit: true } };
export const Point: Story = { args: { point: true } };
export const Common: Story = { args: { common: true } };
