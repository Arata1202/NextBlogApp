import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ArticleFeature from '@/components/Features/Article';
import { createArticle } from '@/test/factories';

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

describe('ArticleFeature', () => {
  it('composes article content, table of contents, in-content ads, and related articles', () => {
    const relatedArticle = createArticle({
      id: 'related-article',
      title: 'Related article',
    });
    const linkedArticle = createArticle({
      id: 'linked-article',
      title: 'Linked article',
    });
    const article = createArticle({
      title: 'Main article',
      introduction_blocks: [
        {
          rich_text: '<p>Introduction text</p>',
          bubble_text: 'Bubble text',
          bubble_image: {
            url: 'https://images.microcms-assets.io/assets/site/avatar.png',
            width: 300,
            height: 300,
          },
          box_merit: '<strong>Merit content</strong>',
          article_link: linkedArticle,
        },
      ],
      content_blocks: [
        {
          rich_text:
            '<h2 id="first">First section</h2><p>First body</p><h2 id="second">Second section</h2>',
        },
      ],
    });

    render(<ArticleFeature data={article} relatedArticles={[relatedArticle]} />);

    expect(screen.getByRole('heading', { name: 'Main article' })).toBeInTheDocument();
    expect(screen.getByText('記事内に広告が含まれています。')).toBeInTheDocument();
    expect(screen.getByText('Introduction text')).toBeInTheDocument();
    expect(screen.getByText('Bubble text')).toBeInTheDocument();
    expect(screen.getByText('Merit content')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1 First section' })).toHaveAttribute('href', '#first');
    expect(screen.getByRole('link', { name: '2 Second section' })).toHaveAttribute(
      'href',
      '#second',
    );
    expect(screen.getAllByTestId('ad-unit').map((ad) => ad.getAttribute('data-slot'))).toEqual([
      '3862359702',
      '4134656590',
    ]);
    expect(screen.getByText('Linked article')).toBeInTheDocument();
    expect(screen.getByText('Related article')).toBeInTheDocument();
  });
});
