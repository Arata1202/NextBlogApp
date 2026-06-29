import { describe, expect, it } from 'vitest';
import { resolveAppWebViewNavigationUrl } from '@/components/Common/AppWebViewLinkHandler';

describe('resolveAppWebViewNavigationUrl', () => {
  const origin = 'https://realunivlog.com';

  it('adds app mode to same-origin links', () => {
    expect(resolveAppWebViewNavigationUrl('/articles/sample', origin)).toBe(
      'https://realunivlog.com/articles/sample?app=1',
    );
  });

  it('leaves same-origin app links alone for normal current-frame navigation', () => {
    expect(resolveAppWebViewNavigationUrl('/articles/sample?app=1', origin)).toBeNull();
  });

  it('forces target blank app links into the current frame', () => {
    expect(resolveAppWebViewNavigationUrl('/articles/sample?app=1', origin, '_blank')).toBe(
      'https://realunivlog.com/articles/sample?app=1',
    );
  });

  it('lets normal external links reach the Flutter navigation delegate', () => {
    expect(resolveAppWebViewNavigationUrl('https://example.com/article', origin)).toBeNull();
  });

  it('forces target blank external links into the current frame', () => {
    expect(resolveAppWebViewNavigationUrl('https://example.com/article', origin, '_blank')).toBe(
      'https://example.com/article',
    );
  });

  it('ignores non-web protocols', () => {
    expect(resolveAppWebViewNavigationUrl('mailto:hello@example.com', origin, '_blank')).toBeNull();
  });
});
