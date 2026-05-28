import { act, render, screen } from '@testing-library/react';
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
    default: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'slider' }, children),
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

  it('renders speech bubble image with optimized microCMS parameters', () => {
    render(
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
    expect(screen.getByRole('img', { name: '吹き出しのイメージ' })).toHaveAttribute(
      'src',
      expect.stringContaining('w=150'),
    );
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
    render(
      <ImageSlider
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

    expect(screen.getByRole('img', { name: 'スライダー画像 1' })).toHaveAttribute(
      'loading',
      'eager',
    );
    expect(screen.queryByTestId('slider')).not.toBeInTheDocument();
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
