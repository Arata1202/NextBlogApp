import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Markdown from '@/components/Common/Markdown';

describe('Markdown', () => {
  it('copies markdown code block content from the icon button', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<Markdown content={'```ts\nconst value = 1;\n```'} />);

    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();

    const wrapButton = screen.getByRole('button', { name: 'コードを折り返す' });

    expect(wrapButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(wrapButton);

    expect(
      screen.getByRole('button', {
        name: 'コードの折り返しを解除',
      }),
    ).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'コードをコピー' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('const value = 1;\n');
    });
    expect(await screen.findByRole('button', { name: 'コピー済み' })).toBeInTheDocument();
  });

  it('opens external links in a new tab and leaves internal links in the same tab', () => {
    render(
      <Markdown content="[Internal](/profile)\n\n[Relative](profile)\n\n[Hash](#section)\n\n[Email](mailto:test@example.com)\n\n[Unsafe](javascript:alert(1))\n\n[External](https://example.com)" />,
    );

    expect(screen.getByRole('link', { name: 'Internal' })).toHaveAttribute('href', '/profile');
    expect(screen.getByRole('link', { name: 'Internal' })).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: 'Relative' })).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: 'Hash' })).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
    expect(screen.getByText('Unsafe').closest('a')).not.toHaveAttribute('target');
    const externalLink = screen.getByRole('link', {
      name: /External\s*新しいタブで開きます/,
    });
    expect(externalLink).toHaveAttribute('href', 'https://example.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the profile image when profile mode is enabled', () => {
    render(<Markdown content="## Profile" profile />);

    expect(screen.getByRole('img', { name: '筆者' })).toHaveAttribute(
      'src',
      '/images/blog/face.webp',
    );
  });

  it('applies provided ids to markdown headings', () => {
    render(<Markdown content={'## Intro\n\n### Details'} headingIds={['intro', 'details']} />);

    expect(screen.getByRole('heading', { name: 'Intro' })).toHaveAttribute('id', 'intro');
    expect(screen.getByRole('heading', { name: 'Details' })).toHaveAttribute('id', 'details');
  });
});
