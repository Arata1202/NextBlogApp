import { describe, expect, it } from 'vitest';
import { sanitizeCmsHtml } from '@/utils/htmlSanitizer';

describe('sanitizeCmsHtml', () => {
  it('removes scripts, event attributes, and unsafe URL schemes from CMS html', () => {
    const html = sanitizeCmsHtml(`
      <p onclick="alert(1)">Text</p>
      <a href="javascript:alert(1)">Unsafe link</a>
      <img src="data:image/svg+xml,<svg onload=alert(1)>">
      <script>window.__unsafe = true;</script>
    `);

    expect(html).toContain('<p>Text</p>');
    expect(html).toContain('<a>Unsafe link</a>');
    expect(html).toContain('<img>');
    expect(html).not.toContain('onclick');
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('data:');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('window.__unsafe');
  });

  it('preserves safe CMS links and image URLs', () => {
    const html = sanitizeCmsHtml(`
      <a href="https://example.com/article">Article</a>
      <img src="https://images.microcms-assets.io/assets/site/image.png" alt="Image">
    `);

    expect(html).toContain('href="https://example.com/article"');
    expect(html).toContain('src="https://images.microcms-assets.io/assets/site/image.png"');
    expect(html).toContain('alt="Image"');
  });
});
