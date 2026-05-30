import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RichText from '@/components/Features/Article/Elements/Plugins/RichText';
import CustomHtml from '@/components/Features/Article/Elements/Plugins/CustomHtml';
import SpeechBubble from '@/components/Features/Article/Elements/Plugins/SpeechBubble';
import TabBox from '@/components/Features/Article/Elements/Plugins/TabBox';
import ImageSlider from '@/components/Features/Article/Elements/Plugins/ImageSlider';
import WantToRead from '@/components/Features/Article/Elements/Plugins/WantToRead';
import { createArticle } from '@/test/factories';
import type { ContentBlock } from '@/types/microcms';

vi.mock('@/components/ThirdParties/GoogleAdSense/Elements/AdUnit', async () => {
  const React = await import('react');

  return {
    default: ({ slot }: { slot: string }) =>
      React.createElement('div', { 'data-testid': 'ad-unit', 'data-slot': slot }, slot),
  };
});

vi.mock('react-slick', async () => {
  const React = await import('react');

  return {
    default: ({
      children,
      customPaging,
      dots,
      nextArrow,
      prevArrow,
    }: {
      children: React.ReactNode;
      customPaging?: (index: number) => React.ReactElement;
      dots?: boolean;
      nextArrow?: React.ReactElement;
      prevArrow?: React.ReactElement;
    }) =>
      React.createElement(
        'div',
        { 'data-testid': 'slider' },
        prevArrow,
        children,
        dots &&
          customPaging &&
          React.createElement(
            'div',
            { 'data-testid': 'slider-dots' },
            Array.from({ length: React.Children.count(children) }, (_, index) =>
              React.cloneElement(customPaging(index), { key: index }),
            ),
          ),
        nextArrow,
      ),
  };
});

describe('Article plugins', () => {
  it('renders rich text and injects article ad units before h2 sections', () => {
    render(
      <RichText
        block={{
          rich_text: '<p>Lead</p><h2 id="first">First</h2><p>Body</p><h2 id="second">Second</h2>',
        }}
        adSlots={['slot-a', 'slot-b']}
        articleTitle="Article title"
      />,
    );

    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'First' })).toBeInTheDocument();
    expect(screen.getAllByTestId('ad-unit').map((ad) => ad.getAttribute('data-slot'))).toEqual([
      'slot-a',
      'slot-b',
    ]);
  });

  it('replays custom html scripts after mounting', () => {
    vi.useFakeTimers();
    render(
      <CustomHtml
        block={{
          custom_html:
            '<div id="custom-target">Before</div><script>window.__customHtmlTest = true;</script>',
        }}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(document.querySelector('script[data-custom-html-executed="true"]')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('adds target blank to custom html links without overwriting existing targets', async () => {
    render(
      <CustomHtml
        block={{
          custom_html: `
            <a href="https://example.com">External link</a>
            <a href="https://example.com/self" target="_self" rel="nofollow">Existing target</a>
            <a href="#">Placeholder link</a>
          `,
        }}
      />,
    );

    const externalLink = screen.getByRole('link', { name: 'External link' });
    const existingTargetLink = screen.getByRole('link', { name: 'Existing target' });
    const placeholderLink = screen.getByRole('link', { name: 'Placeholder link' });

    await waitFor(() => {
      expect(externalLink).toHaveAttribute('target', '_blank');
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
    expect(existingTargetLink).toHaveAttribute('target', '_self');
    expect(existingTargetLink).toHaveAttribute('rel', 'nofollow');
    expect(placeholderLink).not.toHaveAttribute('target');
  });

  it('adds target blank to custom html links inserted after mounting', async () => {
    const { container } = render(
      <CustomHtml
        block={{
          custom_html: '<div id="generated-link-target"></div>',
        }}
      />,
    );
    const customHtml = container.querySelector('[data-custom-html]');
    const link = document.createElement('a');

    link.href = 'https://example.com/product';
    link.textContent = 'Generated link';
    customHtml?.appendChild(link);

    await waitFor(() => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('moves Moshimo EasyLink images with fallback arrow controls', async () => {
    render(
      <CustomHtml
        block={{
          custom_html: `
            <div class="easyLink-box">
              <div class="easyLink-img">
                <p class="easyLink-img-box">
                  <span>
                    <img
                      class="easyLink-img-pht js-item-image"
                      src="one.png"
                      alt="one"
                      data-testid="first-image"
                    >
                  </span>
                  <span class="waiting">
                    <img
                      class="js-item-image"
                      data-img_src="two.png"
                      alt="two"
                      data-testid="second-image"
                    >
                  </span>
                  <a href="#" class="easyLink-arrow-left"><img src="left.png" alt=""></a>
                  <a href="#" class="easyLink-arrow-right"><img src="right.png" alt=""></a>
                </p>
              </div>
            </div>
          `,
        }}
      />,
    );

    const leftArrow = await screen.findByRole('button', { name: '前の画像を表示' });
    const rightArrow = screen.getByRole('button', { name: '次の画像を表示' });
    const firstImage = screen.getByTestId('first-image');
    const secondImage = screen.getByTestId('second-image');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });

    rightArrow.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
    await waitFor(() => {
      expect(firstImage).not.toHaveClass('easyLink-img-pht');
      expect(firstImage).toHaveStyle({ display: 'none' });
      expect(secondImage).toHaveClass('easyLink-img-pht');
      expect(secondImage).toHaveAttribute('src', 'two.png');
      expect(secondImage.style.display).toBe('unset');
    });
    expect(secondImage.parentElement).not.toHaveClass('waiting');

    fireEvent.keyDown(leftArrow, { key: ' ' });

    expect(firstImage).toHaveClass('easyLink-img-pht');
    expect(firstImage.style.display).toBe('unset');
    expect(secondImage).not.toHaveClass('easyLink-img-pht');
    expect(secondImage).toHaveStyle({ display: 'none' });
  });

  it('does not double-move Moshimo EasyLink images when the official handler already moved them', async () => {
    render(
      <CustomHtml
        block={{
          custom_html: `
            <div class="easyLink-box">
              <div class="easyLink-img">
                <p class="easyLink-img-box">
                  <span>
                    <img
                      class="easyLink-img-pht js-item-image"
                      src="one.png"
                      alt="one"
                      data-testid="first-image"
                    >
                  </span>
                  <span class="waiting">
                    <img
                      class="js-item-image"
                      data-img_src="two.png"
                      alt="two"
                      data-testid="second-image"
                    >
                  </span>
                  <a href="#" class="easyLink-arrow-right">
                    <img src="right.png" alt="" data-testid="right-arrow-image">
                  </a>
                </p>
              </div>
            </div>
          `,
        }}
      />,
    );

    const rightArrowImage = screen.getByTestId('right-arrow-image');
    const firstImage = screen.getByTestId('first-image');
    const secondImage = screen.getByTestId('second-image');

    rightArrowImage.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        firstImage.classList.remove('easyLink-img-pht');
        secondImage.classList.add('easyLink-img-pht');
      },
      true,
    );

    rightArrowImage.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    await waitFor(() => {
      expect(firstImage).not.toHaveClass('easyLink-img-pht');
      expect(secondImage).toHaveClass('easyLink-img-pht');
    });
  });

  it('renders speech bubble image with optimized microCMS parameters', () => {
    const { container } = render(
      <SpeechBubble
        block={{
          bubble_text: 'Hello',
          bubble_image: {
            url: 'https://images.microcms-assets.io/assets/site/avatar.png',
            width: 300,
            height: 300,
          },
          bubble_isRight: true,
        }}
      />,
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('src', expect.stringContaining('w=150'));
  });

  it('renders each tab box variant from its corresponding html field', () => {
    const block: ContentBlock = {
      box_merit: '<strong>Merit</strong>',
      box_demerit: '<strong>Demerit</strong>',
      box_point: '<strong>Point</strong>',
      box_common: '<strong>Common</strong>',
    };

    const { rerender } = render(<TabBox block={block} merit />);
    expect(screen.getByText('Merit')).toBeInTheDocument();

    rerender(<TabBox block={block} demerit />);
    expect(screen.getByText('Demerit')).toBeInTheDocument();

    rerender(<TabBox block={block} point />);
    expect(screen.getByText('Point')).toBeInTheDocument();

    rerender(<TabBox block={block} common />);
    expect(screen.getByText('Common')).toBeInTheDocument();
  });

  it('renders a single valid slider image without loading the carousel chrome', () => {
    const { container } = render(
      <ImageSlider
        imageAltFallback="Article title"
        block={{
          image_slider: [
            {
              url: 'https://images.microcms-assets.io/assets/site/slide.png',
              width: 960,
              height: 540,
            },
            { url: '', width: 960, height: 540 },
          ],
        }}
      />,
    );

    const image = container.querySelector('img');
    expect(image).toHaveAttribute('alt', 'Article titleの画像');
    expect(image).toHaveAttribute('loading', 'eager');
    expect(screen.queryByTestId('slider')).not.toBeInTheDocument();
  });

  it('renders accessible slider arrows for multiple images', () => {
    render(
      <ImageSlider
        imageAltFallback="Article title"
        block={{
          image_slider: [
            {
              url: 'https://images.microcms-assets.io/assets/site/slide-1.png',
              width: 960,
              height: 540,
            },
            {
              url: 'https://images.microcms-assets.io/assets/site/slide-2.png',
              width: 960,
              height: 540,
            },
          ],
        }}
      />,
    );

    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Article titleの画像スライダー' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '前の画像を表示' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '次の画像を表示' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1枚目の画像を表示中' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', { name: '2枚目の画像を表示' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '1枚目 / 全2枚' })).toBeInTheDocument();
    expect(screen.getByText('1枚目 / 全2枚')).toHaveAttribute('aria-live', 'polite');
  });

  it('renders related article links from the want-to-read plugin', () => {
    render(
      <WantToRead
        block={{
          article_link: createArticle({
            id: 'linked-article',
            title: 'Linked article',
          }),
        }}
      />,
    );

    expect(screen.getByText('あわせて読みたい')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/articles/linked-article');
    expect(screen.getByText('Linked article')).toBeInTheDocument();
  });
});
