import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SearchPage from '@/components/Pages/Search';
import { createArticle, createTag, createUnifiedArticle } from '@/test/factories';

const fetchMock = vi.fn();
const pageHeadingMock = vi.fn();
const articleListMock = vi.fn();
const paginationMock = vi.fn();

vi.mock('@/components/Common/PageHeading', () => ({
  default: ({
    page,
    isLoading,
  }: {
    page: { type: 'search'; searchKeyword?: string };
    isLoading?: boolean;
  }) => {
    pageHeadingMock({ page, isLoading });

    return <div>{isLoading ? 'heading-loading' : `「${page.searchKeyword ?? ''}」の検索結果`}</div>;
  },
}));

vi.mock('@/components/Common/ArticleList', () => ({
  default: (props: {
    articles: { title: string }[];
    emptyMessage: string;
    isLoading?: boolean;
  }) => {
    articleListMock(props);

    return (
      <div>
        {props.articles.map((article) => (
          <div key={article.title}>{article.title}</div>
        ))}
        {!props.isLoading && props.articles.length === 0 && <div>{props.emptyMessage}</div>}
      </div>
    );
  },
}));

vi.mock('@/components/Common/Pagination', () => ({
  default: (props: { totalCount: number; current: number }) => {
    paginationMock(props);

    return <div>{`pagination:${props.totalCount}:${props.current}`}</div>;
  },
}));

vi.mock('@/components/ThirdParties/GoogleAdSense/Elements/AdUnit', () => ({
  default: () => null,
}));

describe('SearchPage', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_SEARCH_URL = '/api/search';
    window.history.pushState({}, '', '/search');
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    pageHeadingMock.mockReset();
    articleListMock.mockReset();
    paginationMock.mockReset();
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_API_SEARCH_URL;
    vi.unstubAllGlobals();
  });

  it('fetches search results from the configured API', async () => {
    window.history.pushState({}, '', '/search?q=React&page=2');
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        contents: [createArticle({ title: 'React article' })],
        totalCount: 12,
      }),
    });

    render(
      <SearchPage
        recentArticles={[createUnifiedArticle()]}
        tags={[createTag({ id: 'react', name: 'React' })]}
        archiveList={[{ year: '2024', month: '1' }]}
      />,
    );

    expect(screen.getByText('「React」の検索結果')).toBeInTheDocument();
    expect(await screen.findByText('React article')).toBeInTheDocument();
    expect(screen.getByText('pagination:12:2')).toBeInTheDocument();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    const parsedUrl = new URL(url);
    expect(parsedUrl.pathname).toBe('/api/search');
    expect(parsedUrl.searchParams.get('q')).toBe('React');
    expect(parsedUrl.searchParams.get('limit')).toBe('10');
    expect(parsedUrl.searchParams.get('offset')).toBe('10');
    expect(init).toEqual(
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }),
    );
  });

  it('renders the list skeleton while fetching results', async () => {
    window.history.pushState({}, '', '/search?q=React');
    fetchMock.mockReturnValue(new Promise(() => {}));

    render(<SearchPage tags={[]} archiveList={[]} />);

    await waitFor(() =>
      expect(articleListMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isLoading: true,
        }),
      ),
    );
    expect(pageHeadingMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isLoading: undefined,
      }),
    );
    expect(screen.getByText('「React」の検索結果')).toBeInTheDocument();
    expect(screen.queryByText('記事はまだありません')).not.toBeInTheDocument();
    expect(screen.queryByText('検索中...')).not.toBeInTheDocument();
  });

  it('does not fetch until a query is provided', () => {
    render(<SearchPage tags={[]} archiveList={[]} />);

    expect(screen.getByText('記事はまだありません')).toBeInTheDocument();
    expect(screen.getByText('「」の検索結果')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(articleListMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [],
        emptyMessage: '記事はまだありません',
        isLoading: false,
      }),
    );
    expect(paginationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        totalCount: 0,
        current: 1,
      }),
    );
  });

  it('does not show API errors to users', async () => {
    window.history.pushState({}, '', '/search?q=React');
    fetchMock.mockRejectedValue(new Error('network error'));

    render(<SearchPage tags={[]} archiveList={[]} />);

    await waitFor(() =>
      expect(articleListMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          articles: [],
          emptyMessage: '記事はまだありません',
          isLoading: false,
        }),
      ),
    );

    expect(screen.getByText('記事はまだありません')).toBeInTheDocument();
    expect(
      screen.queryByText('検索に失敗しました。時間をおいて再度お試しください。'),
    ).not.toBeInTheDocument();
  });
});
