import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
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

export const WithFilename: Story = {
  args: {
    filename: 'greeting.ts',
    children: <code className={codeBlockStyles.code}>{sampleCode}</code>,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('greeting.ts')).toBeVisible();
    await expect(canvas.getByRole('region', { name: 'コードブロック: greeting.ts' })).toBeVisible();
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
