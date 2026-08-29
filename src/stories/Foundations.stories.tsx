import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTheme } from 'next-themes';
import { expect } from 'storybook/test';

type ColorToken = {
  name: string;
  variable: `--color-${string}`;
  value: string;
};

type TypographyToken = {
  name: string;
  variable: `--font-size-${string}`;
  value: string;
  sample: string;
};

const themeColors: ColorToken[] = [
  { name: 'Light background', variable: '--color-theme-light-background', value: '#fff' },
  { name: 'Light text', variable: '--color-theme-light-text', value: '#374151' },
  { name: 'Light border', variable: '--color-theme-light-border', value: '#d1d5db' },
  { name: 'Dark background', variable: '--color-theme-dark-background', value: '#262626' },
  { name: 'Dark text', variable: '--color-theme-dark-text', value: '#fff' },
  { name: 'Dark border', variable: '--color-theme-dark-border', value: '#6b7280' },
];

const contentColors: ColorToken[] = [
  { name: 'Secondary text', variable: '--color-text-sub', value: '#767676' },
  { name: 'Subtle background', variable: '--color-bg-sub', value: '#f3f3f3' },
  { name: 'Border', variable: '--color-border', value: '#ddd' },
  { name: 'Dark border', variable: '--color-border-dark', value: '#ccc' },
  { name: 'Soft accent background', variable: '--color-accent-soft-bg', value: '#eaf4fc' },
  { name: 'Soft accent text', variable: '--color-accent-soft-text', value: '#111827' },
  { name: 'Link', variable: '--color-link', value: '#1d4ed8' },
  { name: 'Link hover', variable: '--color-link-hover', value: '#1e40af' },
  { name: 'Dark link', variable: '--color-link-dark', value: '#93c5fd' },
  { name: 'Dark link hover', variable: '--color-link-dark-hover', value: '#bfdbfe' },
  { name: 'Code background', variable: '--color-bg-code', value: '#0d1117' },
  { name: 'Code text', variable: '--color-text-code', value: '#c9d1d9' },
  { name: 'Focus ring', variable: '--color-focus-ring', value: '#2563eb' },
];

const typography: TypographyToken[] = [
  {
    name: 'Heading 1',
    variable: '--font-size-content-heading-1',
    value: '2rem',
    sample: '記事タイトル',
  },
  {
    name: 'Heading 2',
    variable: '--font-size-content-heading-2',
    value: '1.6rem',
    sample: '大見出し',
  },
  {
    name: 'Heading 3',
    variable: '--font-size-content-heading-3',
    value: '1.4rem',
    sample: '中見出し',
  },
  {
    name: 'Heading 4',
    variable: '--font-size-content-heading-4',
    value: '1.2rem',
    sample: '小見出し',
  },
  {
    name: 'Heading 5',
    variable: '--font-size-content-heading-5',
    value: '1.1rem',
    sample: '補助見出し',
  },
  {
    name: 'Body',
    variable: '--font-size-content-body',
    value: '18px',
    sample: '記事本文の基準サイズです。',
  },
  {
    name: 'Small',
    variable: '--font-size-content-small',
    value: '0.8rem',
    sample: '画像キャプションなどの補足情報',
  },
];

const typographyDetails = [
  { variable: '--font-weight-content-heading', value: '700' },
  { variable: '--line-height-content-body', value: '2' },
] as const;

const codeTokens = [
  {
    variable: '--font-mono',
    value:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  { variable: '--font-family-content-code', value: 'menlo, inconsolata, monospace' },
  { variable: '--radius-small', value: '4px' },
] as const;

const focusTokens = [
  { variable: '--color-focus-ring', value: '#2563eb' },
  { variable: '--focus-ring-width', value: '2px' },
  { variable: '--focus-ring-offset', value: '2px' },
] as const;

const documentedTokens = [
  ...themeColors,
  ...contentColors,
  ...typography,
  ...typographyDetails,
  ...codeTokens,
  ...focusTokens,
];

function normalizeCssValue(value: string) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(
      /(^|[\s,(])(-?)\.(\d+)/g,
      (_, prefix: string, sign: string, digits: string) => `${prefix}${sign}0.${digits}`,
    );
}

function TokenDetails({ variable, value }: { variable: string; value: string }) {
  return (
    <div className="space-y-1 p-3">
      <code className="block text-sm">{variable}</code>
      <code className="block text-xs opacity-75">{value}</code>
    </div>
  );
}

function ColorPalette({ colors }: { colors: ColorToken[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {colors.map(({ name, variable, value }) => (
        <article className="overflow-hidden rounded-lg border" key={variable}>
          <div
            className="h-20 border-b"
            style={{ backgroundColor: `var(${variable})` }}
            aria-hidden="true"
          />
          <div className="px-3 pt-3 font-semibold">{name}</div>
          <TokenDetails variable={variable} value={value} />
        </article>
      ))}
    </div>
  );
}

function TypographyScale() {
  return (
    <div className="space-y-4">
      {typography.map(({ name, variable, value, sample }) => {
        const style = {
          fontSize: `var(${variable})`,
          fontWeight: name.startsWith('Heading') ? 'var(--font-weight-content-heading)' : undefined,
          lineHeight: name === 'Body' ? 'var(--line-height-content-body)' : undefined,
        } satisfies CSSProperties;

        return (
          <article className="rounded-lg border p-4" key={variable}>
            <div style={style}>{sample}</div>
            <div className="mt-3 text-sm font-semibold">{name}</div>
            <TokenDetails variable={variable} value={value} />
          </article>
        );
      })}
    </div>
  );
}

function Foundations() {
  const { resolvedTheme } = useTheme();
  const themedContentColors = contentColors.map((token) =>
    token.variable === '--color-text-sub'
      ? { ...token, value: resolvedTheme === 'dark' ? '#999' : '#767676' }
      : token,
  );

  return (
    <main className="mx-auto max-w-7xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold">Design foundations</h1>
        <div className="mt-2 text-base">
          Tailwind CSS v4を基礎に、NextBlogApp固有のCSS変数を補完しています。
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Theme colors</h2>
        <ColorPalette colors={themeColors} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Content colors</h2>
        <ColorPalette colors={themedContentColors} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Content typography</h2>
        <div className="text-base">
          記事本文で使用するサイズ、ウェイト、行間を実際のトークンで表示しています。
        </div>
        <TypographyScale />
        <div className="grid gap-3 sm:grid-cols-2">
          {typographyDetails.map((token) => (
            <TokenDetails key={token.variable} {...token} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Code</h2>
        <div
          className="overflow-x-auto p-4"
          style={{
            backgroundColor: 'var(--color-bg-code)',
            color: 'var(--color-text-code)',
            fontFamily: 'var(--font-family-content-code)',
            borderRadius: 'var(--radius-small)',
          }}
        >
          <code>const theme = &apos;NextBlogApp&apos;;</code>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {codeTokens.map((token) => (
            <TokenDetails key={token.variable} {...token} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Focus</h2>
        <div className="text-base">Tabキーで、実際のフォーカスリングを確認できます。</div>
        <a className="inline-flex rounded-md border px-4 py-2" href="#focus-example">
          フォーカス表示を確認
        </a>
        <div className="grid gap-3 sm:grid-cols-3">
          {focusTokens.map((token) => (
            <TokenDetails key={token.variable} {...token} />
          ))}
        </div>
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

export const Default: Story = {
  play: async () => {
    const rootStyles = getComputedStyle(document.documentElement);

    for (const { variable, value } of documentedTokens) {
      const actualValue = normalizeCssValue(rootStyles.getPropertyValue(variable));
      await expect(actualValue).toBe(normalizeCssValue(value));
    }
  },
};
