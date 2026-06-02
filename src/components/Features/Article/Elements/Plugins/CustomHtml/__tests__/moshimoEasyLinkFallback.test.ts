import { describe, expect, it } from 'vitest';
import { setupMoshimoEasyLinkFallback } from '@/components/Features/Article/Elements/Plugins/CustomHtml/moshimoEasyLinkFallback';

describe('setupMoshimoEasyLinkFallback', () => {
  it('moves safe data-img_src values into active image src attributes', () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="easyLink-box">
        <div class="easyLink-img-box">
          <img class="easyLink-img-pht" src="https://example.com/active.jpg">
          <img class="js-item-image" data-img_src="https://example.com/next.jpg">
        </div>
        <a class="easyLink-arrow-right" href="#">Next</a>
      </div>
    `;

    const cleanup = setupMoshimoEasyLinkFallback(content);

    content.querySelector<HTMLAnchorElement>('.easyLink-arrow-right')?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter',
      }),
    );

    const nextImage = content.querySelectorAll<HTMLImageElement>('img')[1];

    expect(nextImage).toHaveAttribute('src', 'https://example.com/next.jpg');
    expect(nextImage).not.toHaveAttribute('data-img_src');

    cleanup();
  });

  it('supports relative data-img_src values for lazy images', () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="easyLink-box">
        <div class="easyLink-img-box">
          <img class="easyLink-img-pht" src="https://example.com/active.jpg">
          <img class="js-item-image" data-img_src="/images/next.jpg">
        </div>
        <a class="easyLink-arrow-right" href="#">Next</a>
      </div>
    `;

    const cleanup = setupMoshimoEasyLinkFallback(content);

    content.querySelector<HTMLAnchorElement>('.easyLink-arrow-right')?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter',
      }),
    );

    const nextImage = content.querySelectorAll<HTMLImageElement>('img')[1];

    expect(nextImage).toHaveAttribute(
      'src',
      new URL('/images/next.jpg', window.location.href).href,
    );
    expect(nextImage).not.toHaveAttribute('data-img_src');

    cleanup();
  });

  it('does not move unsafe data-img_src values into image src attributes', () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="easyLink-box">
        <div class="easyLink-img-box">
          <img class="easyLink-img-pht" src="https://example.com/active.jpg">
          <img class="js-item-image" data-img_src="javascript:alert(1)">
        </div>
        <a class="easyLink-arrow-right" href="#">Next</a>
      </div>
    `;

    const cleanup = setupMoshimoEasyLinkFallback(content);

    content.querySelector<HTMLAnchorElement>('.easyLink-arrow-right')?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter',
      }),
    );

    const nextImage = content.querySelectorAll<HTMLImageElement>('img')[1];

    expect(nextImage).not.toHaveAttribute('src', 'javascript:alert(1)');
    expect(nextImage).not.toHaveAttribute('data-img_src');

    cleanup();
  });
});
