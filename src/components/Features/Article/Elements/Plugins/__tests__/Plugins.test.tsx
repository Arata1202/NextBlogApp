import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RichText from '@/components/Features/Article/Elements/Plugins/RichText';
import CustomHtml from '@/components/Features/Article/Elements/Plugins/CustomHtml';
import SpeechBubble from '@/components/Features/Article/Elements/Plugins/SpeechBubble';
import TabBox from '@/components/Features/Article/Elements/Plugins/TabBox';
import ImageSlider from '@/components/Features/Article/Elements/Plugins/ImageSlider';
import WantToRead from '@/components/Features/Article/Elements/Plugins/WantToRead';
import { createArticle } from '@/test/factories';
import { sanitizeCustomHtml } from '@/utils/sanitizeCustomHtml';
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
  type SliderChildProps = {
    className?: string;
    tabIndex?: number | string;
  };

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
    }) => {
      const slides = React.Children.map(children, (child) => {
        if (!React.isValidElement<SliderChildProps>(child)) {
          return child;
        }

        return React.cloneElement(child, {
          className: `${child.props.className ?? ''} slick-slide`,
          tabIndex: '-1',
        });
      });

      return React.createElement(
        'div',
        { 'data-testid': 'slider' },
        prevArrow,
        slides,
        dots &&
          customPaging &&
          React.createElement(
            'div',
            { 'data-testid': 'slider-dots' },
            Array.from({ length: React.Children.count(slides) }, (_, index) =>
              React.cloneElement(customPaging(index), { key: index }),
            ),
          ),
        nextArrow,
      );
    },
  };
});

const renderCustomHtml = (html: string) => {
  return render(<CustomHtml html={sanitizeCustomHtml(html)} />);
};

describe('Article plugins', () => {
  it('copies rich text code block content from the icon button', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<RichText html="<pre><code>const value = 1;</code></pre>" />);

    const wrapButton = await screen.findByRole('button', { name: 'コードを折り返す' });

    expect(wrapButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(wrapButton);

    expect(
      screen.getByRole('button', {
        name: 'コードの折り返しを解除',
      }),
    ).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(await screen.findByRole('button', { name: 'コードをコピー' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('const value = 1;');
    });
    expect(await screen.findByRole('button', { name: 'コピー済み' })).toBeInTheDocument();
  });

  it('shows rich text code block filenames in the toolbar', async () => {
    render(
      <RichText html='<div data-filename="app.ts"><pre><code>const value = 1;</code></pre></div>' />,
    );

    expect(await screen.findByText('app.ts')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    expect(document.querySelector('[data-filename="app.ts"]')).toHaveAttribute(
      'data-code-filename-mounted',
    );
  });

  it('adds copy controls to custom html code blocks', async () => {
    renderCustomHtml('<pre><code>custom code</code></pre>');

    expect(await screen.findByRole('button', { name: 'コードをコピー' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'コードを折り返す',
      }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders rich text and injects article ad units before h2 sections', () => {
    render(
      <RichText
        html={
          '<p>Lead</p><!--article-content-ad--><h2 id="first">First</h2><p>Body</p><!--article-content-ad--><h2 id="second">Second</h2>'
        }
        adSlots={['slot-a', 'slot-b']}
      />,
    );

    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'First' })).toBeInTheDocument();
    expect(screen.getAllByTestId('ad-unit').map((ad) => ad.getAttribute('data-slot'))).toEqual([
      'slot-a',
      'slot-b',
    ]);
  });

  it('does not replay arbitrary inline custom html scripts after mounting', () => {
    vi.useFakeTimers();
    renderCustomHtml(
      '<div id="custom-target">Before</div><script>window.__customHtmlTest = true;</script>',
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(
      document.querySelector('script[data-custom-html-executed="true"]'),
    ).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('removes dangerous event attributes and javascript URLs from custom html', () => {
    renderCustomHtml(
      '<a href="javascript:alert(1)" onclick="alert(1)">Unsafe link</a><img src="javascript:alert(1)" onerror="alert(1)">',
    );

    const link = screen.getByText('Unsafe link').closest('a');
    const image = document.querySelector('img');

    expect(link).toBeInTheDocument();
    expect(link).not.toHaveAttribute('href');
    expect(link).not.toHaveAttribute('onclick');
    expect(image).not.toHaveAttribute('src');
    expect(image).not.toHaveAttribute('onerror');
  });

  it('adds target blank to custom html links without overwriting existing targets', async () => {
    renderCustomHtml(`
            <a href="https://example.com">External link</a>
            <a href="https://example.com/self" target="_self" rel="nofollow">Existing target</a>
            <a href="#">Placeholder link</a>
          `);

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
    const { container } = renderCustomHtml('<div id="generated-link-target"></div>');
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
    renderCustomHtml(`
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
          `);

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
      expect(secondImage).toHaveAttribute('src', new URL('two.png', window.location.href).href);
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
    renderCustomHtml(`
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
          `);

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
    const previousArrow = screen.getByRole('button', { name: '前の画像を表示' });
    const nextArrow = screen.getByRole('button', { name: '次の画像を表示' });

    expect(previousArrow).toBeInTheDocument();
    expect(nextArrow).toBeInTheDocument();

    nextArrow.focus();
    expect(nextArrow).toHaveFocus();
    fireEvent.click(nextArrow, { detail: 1 });
    expect(nextArrow).not.toHaveFocus();

    previousArrow.focus();
    fireEvent.click(previousArrow, { detail: 0 });
    expect(previousArrow).toHaveFocus();

    expect(screen.getByRole('button', { name: '1枚目の画像を表示中' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', { name: '2枚目の画像を表示' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '1枚目 / 全2枚' })).toBeInTheDocument();
    expect(screen.getByText('1枚目 / 全2枚')).toHaveAttribute('aria-live', 'polite');
  });

  it('removes generated focus targets from slider images and slides', async () => {
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

    const image = screen.getByAltText('Article titleの画像 1');
    const slide = screen.getByRole('group', { name: '1枚目 / 全2枚' });

    expect(image).toHaveAttribute('tabindex', '-1');
    expect(image).toHaveAttribute('draggable', 'false');
    expect(slide).toHaveClass('slick-slide');
    expect(slide).not.toHaveAttribute('tabindex');

    slide.setAttribute('tabindex', '-1');
    await waitFor(() => {
      expect(slide).not.toHaveAttribute('tabindex');
    });
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
