import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import Share from '@/components/Common/Share';
import ShareSection from '@/components/Common/Share/Elements/ShareSection';
import FollowSection from '@/components/Common/Share/Elements/FollowSection';
import BuyMeaCoffee from '@/components/Common/Share/Elements/Elements/BuyMeaCoffee';
import { createArticle } from '@/test/factories';

type ShareButtonProps = {
  url: string;
  title?: string;
  'aria-label'?: string;
  children?: ReactNode;
};

vi.mock('react-share', async () => {
  const React = await import('react');

  const createShareButton =
    (testId: string) =>
    ({ url, title, children, 'aria-label': ariaLabel }: ShareButtonProps) =>
      React.createElement(
        'button',
        {
          type: 'button',
          'aria-label': ariaLabel,
          'data-testid': testId,
          'data-url': url,
          'data-title': title,
        },
        children,
      );

  const ShareIcon = ({ size, round }: { size: number; round: boolean }) =>
    React.createElement('span', {
      'data-icon-size': String(size),
      'data-icon-round': String(round),
    });

  return {
    TwitterShareButton: createShareButton('x-share'),
    XIcon: ShareIcon,
    FacebookShareButton: createShareButton('facebook-share'),
    FacebookIcon: ShareIcon,
    LineShareButton: createShareButton('line-share'),
    LineIcon: ShareIcon,
    HatenaShareButton: createShareButton('hatena-share'),
    HatenaIcon: ShareIcon,
    PocketShareButton: createShareButton('pocket-share'),
    PocketIcon: ShareIcon,
  };
});

describe('Share components', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';
    process.env.NEXT_PUBLIC_BASE_TITLE = 'Example Blog';
  });

  it('builds article share URLs and titles for each share service', () => {
    render(
      <ShareSection
        data={createArticle({
          id: 'article-a',
          title: 'Article A',
        })}
      />,
    );

    expect(screen.getByTestId('x-share')).toHaveAttribute(
      'data-url',
      'https://example.com/articles/article-a',
    );
    expect(screen.getByTestId('x-share')).toHaveAttribute('data-title', 'Article A｜Example Blog');
    expect(screen.getByTestId('line-share')).toHaveAttribute(
      'data-title',
      'Article A｜Example Blog',
    );
    expect(screen.getByRole('button', { name: 'Xでシェア' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Facebookでシェア' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LINEでシェア' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pocketに保存' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'はてなブックマークでシェア' })).toBeInTheDocument();
  });

  it('falls back to the site URL and title when no article is passed', () => {
    render(<ShareSection />);

    expect(screen.getByTestId('x-share')).toHaveAttribute('data-url', 'https://example.com');
    expect(screen.getByTestId('x-share')).toHaveAttribute('data-title', 'Example Blog');
  });

  it('uses the configured base URL for RSS and Feedly follow links', () => {
    render(<FollowSection />);

    const rssLink = screen.getByRole('link', { name: 'RSSフィードを開く' });
    const feedlyLink = screen.getByRole('link', { name: 'Feedlyでフォロー' });

    expect(rssLink).toHaveAttribute('href', 'https://example.com/rss.xml');
    expect(rssLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(feedlyLink).toHaveAttribute(
      'href',
      'https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fexample.com%2Frss.xml',
    );
    expect(feedlyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('composes share, follow, and support sections for an article', () => {
    render(<Share data={createArticle({ id: 'article-a', title: 'Article A' })} />);

    expect(screen.getByText('シェアする')).toBeInTheDocument();
    expect(screen.getByText('フォローする')).toBeInTheDocument();
    expect(screen.getByText('応援する')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'にほんブログ村' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '人気ブログランキング' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'FC2ブログランキング' })).toBeInTheDocument();
    expect(
      screen.getByText((_content, element) =>
        Boolean(
          element?.tagName === 'DIV' &&
            element.textContent ===
              'もしこの記事が役に立ったなら、こちらから ☕ を一杯支援いただけると喜びます',
        ),
      ),
    ).toBeInTheDocument();
  });

  it('changes the support message only when it is tied to an article or sidebar', () => {
    const { container, rerender } = render(<BuyMeaCoffee />);
    const getMessage = () => container.querySelector('[class*="BuyMeaCoffeeMessage"]');

    expect(getMessage()).toHaveTextContent(/^もし記事/);
    const supportLink = screen.getByRole('link', { name: 'BuyMeaCoffee' });

    expect(supportLink).toHaveAttribute('href', 'https://www.buymeacoffee.com/realunivlog');
    expect(supportLink).toHaveAttribute('rel', 'noopener noreferrer');

    rerender(<BuyMeaCoffee data={createArticle({ id: 'article-a', title: 'Article A' })} />);

    expect(getMessage()).toHaveTextContent(/^もしこの記事/);

    rerender(<BuyMeaCoffee sidebar />);

    expect(getMessage()).toHaveTextContent(/^もしこの記事/);
  });
});
