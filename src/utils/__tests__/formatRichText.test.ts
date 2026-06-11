import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { ARTICLE_CONTENT_AD_MARKER, formatRichText } from '@/utils/formatRichText';

describe('formatRichText', () => {
  it('highlights code blocks and marks them as hljs', () => {
    const html = formatRichText(
      '<pre><code class="language-javascript">const value = 1;</code></pre>',
    );
    const $ = load(html);

    expect($('code').hasClass('hljs')).toBe(true);
    expect($('code').html()).toContain('hljs-keyword');
  });

  it('adds responsive microCMS image attributes, alt fallback, and lazy loading', () => {
    const html = formatRichText(`
      <h2>  Main   heading </h2>
      <p><img src="https://images.microcms-assets.io/assets/site/first.png" alt=""></p>
      <p><img src="https://images.microcms-assets.io/assets/site/second.png"></p>
      <h3>Sub heading</h3>
      <p><img src="/local/image.png"></p>
    `);
    const $ = load(html);
    const images = $('img')
      .toArray()
      .map((image) => $(image));

    expect(images[0].attr('alt')).toBe('Main headingの画像');
    expect(images[1].attr('alt')).toBe('Main headingの画像 2');
    expect(images[2].attr('alt')).toBe('Sub headingの画像');
    expect(images[0].attr('src')).toContain('fm=webp');
    expect(images[0].attr('src')).toContain('w=960');
    expect(images[0].attr('srcset')).toContain('640w');
    expect(images[0].attr('srcset')).toContain('1200w');
    expect(images[0].attr('sizes')).toBe('(max-width: 768px) 100vw, 960px');
    expect(images.every((image) => image.attr('loading') === 'lazy')).toBe(true);
    expect(images[2].attr('srcset')).toBeUndefined();
  });

  it('uses the provided image alt fallback when no heading exists', () => {
    const html = formatRichText('<p><img src="/local/image.png"></p>', {
      imageAltFallback: 'Article title',
    });
    const $ = load(html);

    expect($('img').attr('alt')).toBe('Article titleの画像');
  });

  it('inserts the article ad marker before each h2 when requested', () => {
    const html = formatRichText('<h2>First</h2><p>Body</p><h2>Second</h2>', {
      insertAdsBeforeH2: true,
    });

    expect(html.match(new RegExp(ARTICLE_CONTENT_AD_MARKER, 'g'))).toHaveLength(2);
    expect(html.indexOf(ARTICLE_CONTENT_AD_MARKER)).toBeLessThan(html.indexOf('<h2>First</h2>'));
  });

  it('sanitizes unsafe attributes, URLs, and scripts before rendering rich text', () => {
    const html = formatRichText(`
      <p onclick="alert(1)">Body</p>
      <a href="javascript:alert(1)">Unsafe link</a>
      <script>window.__unsafe = true;</script>
    `);

    expect(html).toContain('<p>Body</p>');
    expect(html).toContain('<a>Unsafe link</a>');
    expect(html).not.toContain('onclick');
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('window.__unsafe');
  });
});
