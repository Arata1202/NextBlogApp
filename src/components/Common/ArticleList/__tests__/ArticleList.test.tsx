import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ArticleList from '@/components/Common/ArticleList';
import { createArticle, createTag, createUnifiedArticle } from '@/test/factories';

vi.mock('@/components/ThirdParties/GoogleAdSense/Elements/AdUnit', async () => {
  const React = await import('react');

  return {
    default: ({ slot }: { slot: string }) =>
      React.createElement('div', { 'data-testid': 'ad-unit', 'data-slot': slot }, slot),
  };
});

vi.mock('@/components/Common/Layouts/Sidebar', async () => {
  const React = await import('react');

  return {
    default: () => React.createElement('aside', { 'data-testid': 'sidebar' }, 'Sidebar'),
  };
});

vi.mock('@/components/Common/Share', async () => {
  const React = await import('react');

  return {
    default: () => React.createElement('div', { 'data-testid': 'share' }, 'Share'),
  };
});

describe('ArticleList', () => {
  const tags = [createTag({ id: 'tag-a', name: 'Tag A' })];
  const archiveList = [{ year: '2024', month: '1' }];

  it('renders the empty state when no blog articles exist', () => {
    render(<ArticleList articles={[]} tags={tags} archiveList={archiveList} />);

    expect(screen.getByText('記事はまだありません')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('share')).toBeInTheDocument();
  });

  it('renders skeleton items while loading', () => {
    render(<ArticleList articles={[]} tags={tags} archiveList={archiveList} isLoading />);

    expect(screen.getAllByTestId('article-skeleton')).toHaveLength(3);
    expect(screen.queryByText('記事はまだありません')).not.toBeInTheDocument();
  });

  it('renders blog articles and inserts the list ad after the first three items', () => {
    render(
      <ArticleList
        articles={[
          createArticle({ id: 'a', title: 'Article A' }),
          createArticle({ id: 'b', title: 'Article B' }),
          createArticle({ id: 'c', title: 'Article C' }),
          createArticle({ id: 'd', title: 'Article D' }),
        ]}
        tags={tags}
        archiveList={archiveList}
      />,
    );

    expect(screen.getByText('Article A')).toBeInTheDocument();
    expect(screen.getByText('Article D')).toBeInTheDocument();
    expect(screen.getAllByTestId('ad-unit').map((ad) => ad.getAttribute('data-slot'))).toEqual([
      '9947663897',
      '1831092739',
    ]);
  });

  it('uses mixed unified articles when they are provided', () => {
    render(
      <ArticleList
        articles={[createArticle({ id: 'blog-only', title: 'Blog only' })]}
        mixedArticles={[
          createUnifiedArticle({
            id: 'zenn-a',
            source: 'zenn',
            title: 'Zenn A',
            url: 'https://zenn.dev/user/articles/a',
            thumbnail: undefined,
            thumbnailUrl: 'https://example.com/zenn.png',
          }),
        ]}
        tags={tags}
        archiveList={archiveList}
      />,
    );

    expect(screen.getByText('Zenn A')).toBeInTheDocument();
    expect(screen.queryByText('Blog only')).not.toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });
});
