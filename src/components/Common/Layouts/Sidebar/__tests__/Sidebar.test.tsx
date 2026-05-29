import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import { createTag, createUnifiedArticle } from '@/test/factories';

vi.mock('@/components/ThirdParties/GoogleAdSense/Elements/AdUnit', async () => {
  const React = await import('react');

  return {
    default: ({ slot }: { slot: string }) =>
      React.createElement('div', { 'data-testid': 'ad-unit', 'data-slot': slot }, slot),
  };
});

describe('Sidebar', () => {
  it('renders navigation sections and filters the current article from recent articles', () => {
    render(
      <Sidebar
        recentArticles={[
          createUnifiedArticle({
            id: 'current',
            title: 'Current article',
            url: '/articles/current',
            publishedAt: '2024-03-01T00:00:00.000Z',
          }),
          createUnifiedArticle({
            id: 'recent',
            title: 'Recent article',
            url: '/articles/recent',
            publishedAt: '2024-02-01T00:00:00.000Z',
          }),
          createUnifiedArticle({
            id: 'external',
            source: 'zenn',
            title: 'External recent',
            url: 'https://zenn.dev/user/articles/recent',
            thumbnail: undefined,
            thumbnailUrl: 'https://example.com/zenn.png',
            publishedAt: '2024-01-01T00:00:00.000Z',
          }),
        ]}
        currentArticleUrl="/articles/current/"
        contentBlocks={[{ rich_text: '<h2 id="toc-heading">TOC heading</h2>' }]}
        tags={[createTag({ id: 'react', name: 'React' })]}
        archiveList={[{ year: '2024', month: '1' }]}
      />,
    );

    const searchInput = screen.getByRole('searchbox', { name: '検索' });
    const profileHeading = screen.getByText('ブログ運営者');
    expect(searchInput.compareDocumentPosition(profileHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.getByText('カテゴリー')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute('href', '/tag/react');
    expect(screen.getByText('アーカイブ')).toBeInTheDocument();
    expect(screen.getByText('Recent article')).toBeInTheDocument();
    expect(screen.getByText('External recent')).toBeInTheDocument();
    expect(screen.queryByText('Current article')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1 TOC heading' })).toHaveAttribute(
      'href',
      '#toc-heading',
    );
    expect(screen.getAllByTestId('ad-unit').map((ad) => ad.getAttribute('data-slot'))).toEqual([
      '8452341403',
      '9574685533',
    ]);
  });
});
