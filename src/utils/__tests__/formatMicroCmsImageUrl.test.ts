import { describe, expect, it } from 'vitest';
import { formatMicroCmsImageUrl, isMicroCmsImageUrl } from '@/utils/formatMicroCmsImageUrl';

describe('isMicroCmsImageUrl', () => {
  it('detects the exact microCMS image host', () => {
    expect(isMicroCmsImageUrl('https://images.microcms-assets.io/assets/site/image.png')).toBe(
      true,
    );
    expect(isMicroCmsImageUrl('https://example.com/image.png')).toBe(false);
    expect(isMicroCmsImageUrl('not-a-url')).toBe(false);
  });
});

describe('formatMicroCmsImageUrl', () => {
  it('adds the image optimization query for microCMS images', () => {
    const result = formatMicroCmsImageUrl(
      'https://images.microcms-assets.io/assets/site/image.png?auto=compress',
      { width: 960, quality: 80, fit: 'crop' },
    );
    const url = new URL(result);

    expect(url.hostname).toBe('images.microcms-assets.io');
    expect(url.searchParams.get('auto')).toBe('compress');
    expect(url.searchParams.get('fm')).toBe('webp');
    expect(url.searchParams.get('q')).toBe('80');
    expect(url.searchParams.get('fit')).toBe('crop');
    expect(url.searchParams.get('w')).toBe('960');
  });

  it('adds optional height and device pixel ratio parameters', () => {
    const result = formatMicroCmsImageUrl(
      'https://images.microcms-assets.io/assets/site/image.png',
      { width: 240, height: 126, devicePixelRatio: 2 },
    );
    const url = new URL(result);

    expect(url.searchParams.get('w')).toBe('240');
    expect(url.searchParams.get('h')).toBe('126');
    expect(url.searchParams.get('dpr')).toBe('2');
  });

  it('uses default quality and fit values', () => {
    const result = formatMicroCmsImageUrl(
      'https://images.microcms-assets.io/assets/site/image.png',
    );
    const url = new URL(result);

    expect(url.searchParams.get('q')).toBe('70');
    expect(url.searchParams.get('fit')).toBe('clip');
    expect(url.searchParams.has('w')).toBe(false);
  });

  it('leaves invalid and non-microCMS URLs unchanged', () => {
    expect(formatMicroCmsImageUrl('/local/image.png', { width: 640 })).toBe('/local/image.png');
    expect(formatMicroCmsImageUrl('https://example.com/image.png', { width: 640 })).toBe(
      'https://example.com/image.png',
    );
  });
});
