import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runCustomHtmlScripts } from '@/components/Features/Article/Elements/Plugins/CustomHtml/scripts';

import { applySponsoredRelToLinks, applyTargetBlankToLinks } from '../links';

describe('runCustomHtmlScripts', () => {
  it('stops writing attributes once a sponsored blank link has been normalized', () => {
    const content = document.createElement('div');
    content.innerHTML =
      '<a href="https://sponsor.example/item" target="_blank" rel="opener">offer</a>';
    const enhance = () => {
      applyTargetBlankToLinks(content);
      applySponsoredRelToLinks(content, 'https://sponsor.example');
    };
    enhance();
    const observer = new MutationObserver(() => {});
    observer.observe(content, { attributes: true, subtree: true });
    enhance();
    expect(observer.takeRecords()).toHaveLength(0);
    expect(content.firstElementChild).toHaveAttribute('rel', 'noopener noreferrer sponsored');
    observer.disconnect();
  });
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

  it('leaves SDK loading to the dedicated embed hooks and never executes arbitrary scripts', () => {
    const content = document.createElement('div');
    content.dataset.customHtml = 'true';
    content.innerHTML = '<script src="https://www.instagram.com/embed.js"></script>';
    document.body.appendChild(content);

    const unknown = document.createElement('script');
    unknown.dataset.customHtmlScriptSrc = 'https://example.com/custom-widget.js';
    content.appendChild(unknown);
    runCustomHtmlScripts(content);
    runCustomHtmlScripts(content);
    expect(content.contains(unknown)).toBe(true);
    expect(document.scripts).toHaveLength(2);
    expect(unknown).not.toHaveAttribute('src');
  });

  it('skips a card when a button contains a non-web destination', () => {
    vi.useFakeTimers();
    const content = document.createElement('div');
    content.dataset.customHtml = 'true';
    const script = document.createElement('script');
    script.type = 'application/json';
    script.dataset.moshimoEasyLinkScript = 'true';
    script.textContent = 'msmaflink({"b_l":[{"u_url":"file:///example"}]})';
    content.appendChild(script);
    document.body.appendChild(content);
    runCustomHtmlScripts(content);
    vi.advanceTimersByTime(200);
    expect(window.msmaflink).toBeUndefined();
  });

  it('queues Moshimo EasyLink payloads and loads the official bundle after the render delay', () => {
    vi.useFakeTimers();
    const content = document.createElement('div');
    content.dataset.customHtml = 'true';
    content.innerHTML = `
      <script type="application/json" data-moshimo-easy-link-script="true">
        msmaflink(
      {"n":"Product","b":"Brand","t":"Title with \\"quote\\""});
      </script>
    `;
    document.body.appendChild(content);

    runCustomHtmlScripts(content);

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
