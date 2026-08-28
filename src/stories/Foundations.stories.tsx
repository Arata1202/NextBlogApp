import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const palette = [
  { name: 'Text', variable: '--color-text-main' },
  { name: 'Secondary text', variable: '--color-text-sub' },
  { name: 'Border', variable: '--color-border' },
  { name: 'Focus', variable: '--color-focus-ring' },
  { name: 'Link', variable: '--color-link' },
  { name: 'Soft accent', variable: '--color-accent-soft-bg' },
];

function Foundations() {
  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Design foundations</h1>
        <p className="mt-2 text-base">
          Tailwind CSS v4を基礎に、ブログ固有のCSS変数だけを補完しています。
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Colors</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {palette.map(({ name, variable }) => (
            <div className="overflow-hidden rounded-lg border" key={variable}>
              <div className="h-20" style={{ backgroundColor: `var(${variable})` }} />
              <div className="p-3">
                <div className="font-semibold">{name}</div>
                <code className="text-sm">{variable}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Typography</h2>
        <div className="text-3xl font-bold">Heading 1 / 30px</div>
        <div className="text-2xl font-bold">Heading 2 / 24px</div>
        <div className="text-xl font-bold">Heading 3 / 20px</div>
        <p className="text-base">Body / 16px — 読みやすい本文の基準サイズです。</p>
        <p className="text-sm">Small / 14px — 補足情報に使用します。</p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Focus</h2>
        <a className="inline-flex rounded-md border px-4 py-2" href="#focus-example">
          Tabキーでフォーカスを確認
        </a>
      </section>
    </main>
  );
}

const meta = {
  title: 'Foundations/Overview',
  component: Foundations,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Foundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
