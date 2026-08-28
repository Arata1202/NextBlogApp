import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RichText from '.';

const tableHtml = `
  <table>
    <thead>
      <tr>
        <th>オプション</th>
        <th>設定値</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ランタイム</td>
        <td>Node.js 20.x</td>
      </tr>
      <tr>
        <td>認証タイプ</td>
        <td>None</td>
      </tr>
    </tbody>
  </table>
`;

const meta = {
  title: 'Content/RichText',
  component: RichText,
  tags: ['autodocs'],
} satisfies Meta<typeof RichText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Table: Story = {
  args: { html: tableHtml },
};
