import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runCustomHtmlScripts } from '@/components/Features/Article/Elements/Plugins/CustomHtml/scripts';

describe('runCustomHtmlScripts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.clearTimeout(window.moshimoEasyLinkTimer);
    window.moshimoEasyLinkTimer = undefined;
    delete window.MoshimoAffiliateObject;
    delete window.msmaflink;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('replaces generic custom HTML scripts with executable scripts once', () => {
    const content = document.createElement('div');
    content.dataset.customHtml = 'true';
    content.innerHTML = '<script>window.__customHtmlScriptRan = true;</script>';
    document.body.appendChild(content);

    runCustomHtmlScripts(content, content.innerHTML);
    runCustomHtmlScripts(content, content.innerHTML);

    expect(content.querySelectorAll('script[data-custom-html-executed="true"]')).toHaveLength(1);
  });

  it('queues Moshimo EasyLink payloads and loads the official bundle after the render delay', () => {
    vi.useFakeTimers();
    const content = document.createElement('div');
    content.dataset.customHtml = 'true';
    content.innerHTML = `
      <script>
        msmaflink({"n":"Product","b":"Brand","t":"Title with \\"quote\\""});
      </script>
    `;
    document.body.appendChild(content);

    runCustomHtmlScripts(content, content.innerHTML);

    expect(window.MoshimoAffiliateObject).toBeUndefined();

    vi.advanceTimersByTime(200);

    expect(window.MoshimoAffiliateObject).toBe('msmaflink');
    expect(window.msmaflink?.q).toHaveLength(1);
    expect(window.msmaflink?.q?.[0][0]).toEqual({
      n: 'Product',
      b: 'Brand',
      t: 'Title with "quote"',
    });
    expect(document.getElementById('msmaflink')).toHaveAttribute(
      'src',
      'https://dn.msmstatic.com/site/cardlink/bundle.js?20220329',
    );
  });
});
