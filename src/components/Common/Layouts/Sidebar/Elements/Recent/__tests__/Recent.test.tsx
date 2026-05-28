import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Recent from '@/components/Common/Layouts/Sidebar/Elements/Recent';
import { createUnifiedArticle } from '@/test/factories';

describe('Recent', () => {
  it('filters the current article, sorts by published date, limits to three, and keeps external links safe', () => {
    render(
      <Recent
        currentArticleUrl="/articles/current/"
        recentArticles={[
          createUnifiedArticle({
            id: 'current',
            title: 'Current article',
            url: '/articles/current',
            publishedAt: '2024-04-01T00:00:00.000Z',
          }),
          createUnifiedArticle({
            id: 'old',
            title: 'Old article',
            url: '/articles/old',
            publishedAt: '2024-01-01T00:00:00.000Z',
          }),
          createUnifiedArticle({
            id: 'middle',
            title: 'Middle article',
            url: '/articles/middle',
            publishedAt: '2024-02-01T00:00:00.000Z',
          }),
          createUnifiedArticle({
            id: 'newest',
            title: 'Newest article',
            url: '/articles/newest',
            publishedAt: '2024-03-01T00:00:00.000Z',
          }),
          createUnifiedArticle({
            id: 'external',
            source: 'zenn',
            title: 'External article',
            thumbnail: undefined,
            thumbnailUrl: 'https://example.com/zenn.png',
            url: 'https://zenn.dev/user/articles/external',
            publishedAt: '2024-02-15T00:00:00.000Z',
          }),
        ]}
      />,
    );

    expect(
      screen.getAllByText(/(Newest|External|Middle) article/).map((title) => title.textContent),
    ).toEqual(['Newest article', 'External article', 'Middle article']);
    expect(screen.queryByText('Current article')).not.toBeInTheDocument();
    expect(screen.queryByText('Old article')).not.toBeInTheDocument();

    const externalLink = screen.getByText('External article').closest('a');
    expect(externalLink).toHaveAttribute('href', 'https://zenn.dev/user/articles/external');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('img', { name: 'External article' })).toHaveAttribute(
      'src',
      'https://example.com/zenn.png',
    );
  });
});
