import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const articleListMock = vi.hoisted(() => vi.fn());
const pageDataMock = vi.hoisted(() => ({
  getSidebarData: vi.fn(),
}));
const suspendedSearchPage = vi.hoisted(() => ({
  promise: new Promise(() => {}),
}));

vi.mock('@/libs/pageData', () => pageDataMock);

vi.mock('@/components/Pages/Search', () => ({
  default: () => {
    throw suspendedSearchPage.promise;
  },
}));

vi.mock('@/components/Common/ArticleList', async () => {
  const React = await import('react');

  return {
    default: (props: { isLoading?: boolean }) => {
      articleListMock(props);

      return React.createElement('div', null, props.isLoading ? 'loading-list' : 'empty-list');
    },
  };
});

vi.mock('@/components/ThirdParties/GoogleAdSense/Elements/AdUnit', () => ({
  default: () => null,
}));

describe('search app page', () => {
  beforeEach(() => {
    articleListMock.mockReset();
    pageDataMock.getSidebarData.mockReset();
    pageDataMock.getSidebarData.mockResolvedValue({
      recentArticles: [],
      tags: [],
      archiveList: [],
    });
  });

  it('renders the search fallback as loading while the client search page is suspended', async () => {
    const Page = (await import('@/app/search/page')).default;

    render(await Page());

    expect(screen.getByLabelText('現在のページを読み込み中')).toHaveTextContent('「」の検索結果');
    expect(screen.getByRole('heading', { name: 'ページタイトルを読み込み中' })).toHaveTextContent(
      '「」の検索結果',
    );
    expect(screen.queryByText('検索結果')).not.toBeInTheDocument();
    expect(screen.getByText('loading-list')).toBeInTheDocument();
    expect(screen.queryByText('empty-list')).not.toBeInTheDocument();
    expect(articleListMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [],
        isLoading: true,
      }),
    );
  });
});
