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
    expect(image?.getAttribute('src')).not.toContain(' 1x, ');
    expect(image?.getAttribute('src')).not.toContain('dpr=2');
  });

  it('uses card dimensions when card mode is enabled', () => {
    const { container } = render(<WebpImage article={article} card />);
    const image = container.querySelector('img');

    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('src', expect.stringContaining('w=240'));
    expect(image).toHaveAttribute('src', expect.stringContaining('h=126'));
  });

  it('marks priority images with a high fetch priority', () => {
    render(<WebpImage article={article} priority />);

    expect(screen.getByRole('img', { name: 'Article image' })).toHaveAttribute(
      'fetchpriority',
      'high',
    );
  });

  it('renders sources for webp candidates', () => {
    const { container } = render(<WebpImage article={article} />);
    const sources = container.querySelectorAll('source[type="image/webp"]');

    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute('media', '(max-width: 640px)');
    expect(sources[0]).toHaveAttribute('srcset', expect.stringContaining('dpr=2 2x'));
  });

  it('does not render a broken image when thumbnail is missing', () => {
    const { container } = render(<WebpImage article={{ title: 'No thumbnail' }} />);

    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});
