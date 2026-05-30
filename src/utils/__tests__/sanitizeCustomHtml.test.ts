import { describe, expect, it } from 'vitest';
import { sanitizeCustomHtml } from '@/utils/sanitizeCustomHtml';

describe('sanitizeCustomHtml', () => {
  it('removes dangerous attributes and javascript URLs', () => {
    const html = sanitizeCustomHtml(
      '<a href="javascript:alert(1)" onclick="alert(1)">Unsafe link</a><img src="javascript:alert(1)" onerror="alert(1)">',
    );

    expect(html).toContain('<a>Unsafe link</a>');
    expect(html).toContain('<img>');
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('onclick');
    expect(html).not.toContain('onerror');
  });

  it('removes arbitrary inline scripts and preserves Moshimo payloads as inert scripts', () => {
    const html = sanitizeCustomHtml(`
      <script>window.__unsafe = true;</script>
      <script>msmaflink({"n":"Product"});</script>
    `);

    expect(html).not.toContain('window.__unsafe');
    expect(html).toContain('type="application/json"');
    expect(html).toContain('data-moshimo-easy-link-script="true"');
    expect(html).toContain('msmaflink({"n":"Product"});');
  });

  it('converts external scripts to inert placeholders', () => {
    const html = sanitizeCustomHtml('<script src="https://example.com/widget.js"></script>');

    expect(html).toContain('type="application/json"');
    expect(html).toContain('data-custom-html-script-src="https://example.com/widget.js"');
    expect(html).not.toContain('<script src=');
  });
});
