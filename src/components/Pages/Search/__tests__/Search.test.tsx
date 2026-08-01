import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
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
    mixedArticles?: { title: string }[];
    emptyMessage: string;
    emptyAction?: ReactNode;
    isLoading?: boolean;
  }) => {
    articleListMock(props);
    const visibleArticles = props.mixedArticles ?? props.articles;

    return (
      <div>
        {visibleArticles.map((article) => (
          <div key={article.title}>{article.title}</div>
        ))}
        {!props.isLoading && visibleArticles.length === 0 && <div>{props.emptyMessage}</div>}
        {props.emptyAction}
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
    vi.useRealTimers();
    delete process.env.NEXT_PUBLIC_API_SEARCH_URL;
    vi.unstubAllGlobals();
  });

  it('fetches search results from the configured API', async () => {
    window.history.pushState({}, '', '/search?q=React&page=2');
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        contents: [createArticle({ id: 'react-article', title: 'React article' })],
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
    expect(articleListMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        mixedArticles: [
          expect.objectContaining({
            id: 'blog-react-article',
            source: 'blog',
            url: '/articles/react-article',
          }),
        ],
      }),
    );

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

  it('stops loading and shows retry UI when the request times out', async () => {
    vi.useFakeTimers();
    window.history.pushState({}, '', '/search?q=React');
    fetchMock.mockImplementation(
      (_url: RequestInfo | URL, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted', 'AbortError'));
          });
        }),
    );

    render(<SearchPage tags={[]} archiveList={[]} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(12_000);
    });

    expect(
      screen.getByText('検索に失敗しました。時間をおいて再度お試しください。'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'もう一度検索する' })).toBeInTheDocument();
    expect(articleListMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isLoading: false,
      }),
    );
  });

  it('does not fetch until a query is provided', () => {
    render(<SearchPage tags={[]} archiveList={[]} />);

    expect(screen.getByText('記事はまだありません')).toBeInTheDocument();
    expect(screen.getByText('「」の検索結果')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(articleListMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [],
        mixedArticles: [],
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

  it('renders the app tag index until a query is provided in app mode', () => {
    window.history.pushState({}, '', '/search?app=1');

    render(
      <SearchPage
        tags={[createTag({ id: 'react', name: 'React' })]}
        archiveList={[{ year: '2024', month: '1' }]}
      />,
    );

    expect(screen.getByLabelText('アーカイブ')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2024年1月' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute('href', '/tag/react?app=1');
    expect(screen.queryByText('記事はまだありません')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(articleListMock).not.toHaveBeenCalled();
  });

  it('shows API errors and retries the search', async () => {
    window.history.pushState({}, '', '/search?q=React');
    fetchMock.mockRejectedValueOnce(new Error('network error')).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        contents: [createArticle({ id: 'react-article', title: 'React article' })],
        totalCount: 1,
      }),
    });
    const user = userEvent.setup();

    render(<SearchPage tags={[]} archiveList={[]} />);

    await waitFor(() =>
      expect(articleListMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          articles: [],
          mixedArticles: [],
          emptyMessage: '検索に失敗しました。時間をおいて再度お試しください。',
          isLoading: false,
        }),
      ),
    );

    expect(
      screen.getByText('検索に失敗しました。時間をおいて再度お試しください。'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'もう一度検索する' }));

    expect(await screen.findByText('React article')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
