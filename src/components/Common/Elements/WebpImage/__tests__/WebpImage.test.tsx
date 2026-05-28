import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import WebpImage from '@/components/Common/Elements/WebpImage';

const article = {
  title: 'Article image',
  thumbnail: {
    url: 'https://images.microcms-assets.io/assets/site/image.png',
    width: 1200,
    height: 630,
  },
};

describe('WebpImage', () => {
  it('renders the default responsive image dimensions', () => {
    render(<WebpImage article={article} />);

    const image = screen.getByRole('img', { name: 'Article image' });
    expect(image).toHaveAttribute('width', '1200');
    expect(image).toHaveAttribute('height', '630');
    expect(image).toHaveAttribute('src', expect.stringContaining('w=960'));
    expect(image).toHaveAttribute('src', expect.stringContaining('h=504'));
  });

  it('uses card dimensions when card mode is enabled', () => {
    render(<WebpImage article={article} card />);

    expect(screen.getByRole('img', { name: 'Article image' })).toHaveAttribute(
      'src',
      expect.stringContaining('w=240'),
    );
    expect(screen.getByRole('img', { name: 'Article image' })).toHaveAttribute(
      'src',
      expect.stringContaining('h=126'),
    );
  });

  it('renders sources for webp candidates', () => {
    const { container } = render(<WebpImage article={article} />);
    const sources = container.querySelectorAll('source[type="image/webp"]');

    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute('media', '(max-width: 640px)');
    expect(sources[0]).toHaveAttribute('srcset', expect.stringContaining('dpr=2 2x'));
  });
});
