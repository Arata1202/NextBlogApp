import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CodeBlock, { codeBlockStyles } from '.';

const sampleCode = `export function greeting(name: string) {
  return \`こんにちは、\${name}さん\`;
}`;

const meta = {
  title: 'Content/Code Block',
  component: CodeBlock,
  tags: ['autodocs'],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <code className={codeBlockStyles.code}>{sampleCode}</code>,
  },
};

export const LongLine: Story = {
  args: {
    children: (
      <code className={codeBlockStyles.code}>
        {`const endpoint = 'https://example.com/a/very/long/path/used/to/check/horizontal/scroll/and/line/wrapping';`}
      </code>
    ),
  },
};
