import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Markdown from '@/components/Common/Markdown';

describe('Markdown', () => {
  it('opens external links in a new tab and leaves internal links in the same tab', () => {
    render(<Markdown content="[Internal](/profile)\n\n[External](https://example.com)" />);

    expect(screen.getByRole('link', { name: 'Internal' })).toHaveAttribute('href', '/profile');
    expect(screen.getByRole('link', { name: 'Internal' })).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
  });

  it('renders the profile image when profile mode is enabled', () => {
    render(<Markdown content="## Profile" profile />);

    expect(screen.getByRole('img', { name: '筆者' })).toHaveAttribute(
      'src',
      '/images/blog/face.png',
    );
  });
});
