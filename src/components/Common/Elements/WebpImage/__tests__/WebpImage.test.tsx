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
    expect(image).toHaveAttribute('width', '960');
    expect(image).toHaveAttribute('height', '504');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(image).toHaveAttribute('src', expect.stringContaining('w=960'));
    expect(image).toHaveAttribute('src', expect.stringContaining('h=504'));
    expect(image?.getAttribute('src')).not.toContain(' 1x, ');
    expect(image?.getAttribute('src')).not.toContain('dpr=2');
  });

  it('uses card dimensions when card mode is enabled', () => {
    const { container } = render(<WebpImage article={article} card />);
    const image = container.querySelector('img');

    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '158');
    expect(image).toHaveAttribute('src', expect.stringContaining('w=300'));
    expect(image).toHaveAttribute('src', expect.stringContaining('h=158'));
  });

  it('marks priority images with a high fetch priority', () => {
    render(<WebpImage article={article} priority />);

    expect(screen.getByRole('img', { name: 'Article image' })).toHaveAttribute(
      'fetchpriority',
      'high',
    );
    expect(screen.getByRole('img', { name: 'Article image' })).toHaveAttribute('loading', 'eager');
  });

  it('renders sources for webp candidates', () => {
    const { container } = render(<WebpImage article={article} />);
    const sources = container.querySelectorAll('source[type="image/webp"]');

    expect(sources).toHaveLength(1);
    expect(sources[0]).toHaveAttribute('srcset', expect.stringContaining('dpr=2 2x'));
  });

  it('offers width-based mobile card crops and keeps desktop density candidates', () => {
    const { container } = render(<WebpImage article={article} card />);
    const [mobile, desktop] = container.querySelectorAll('source');
    expect(mobile).toHaveAttribute('media', '(max-width: 640px)');
    expect(mobile).toHaveAttribute('sizes', '100vw');
    const widths = mobile.srcset.split(', ').map((candidate) => {
      const [src, descriptor] = candidate.split(' ');
      const query = new URL(src).searchParams;
      const width = Number(query.get('w'));
      expect(descriptor).toBe(`${width}w`);
      expect(query.get('dpr')).toBe('1');
      expect(Number(query.get('h'))).toBe(Math.round((width * 158) / 300));
      return width;
    });
    expect(widths).toContain(320);
    expect(Math.max(...widths)).toBeGreaterThanOrEqual(640 * 2);
    expect(desktop.srcset).toContain('dpr=2 2x');
  });

  it('does not advertise resized versions of an external card image', () => {
    const url = 'https://example.com/photo.jpg';
    const { container } = render(<WebpImage article={{ ...article, thumbnail: { url } }} card />);
    expect(container.querySelector('source[media]')).toBeNull();
    expect(container.querySelector('img')).toHaveAttribute('src', url);
  });

  it('does not render a broken image when thumbnail is missing', () => {
    const { container } = render(<WebpImage article={{ title: 'No thumbnail' }} />);

    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});
