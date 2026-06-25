'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarDaysIcon, HashtagIcon } from '@heroicons/react/24/solid';
import { Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { UnifiedArticle } from '@/types/unified';
import { LIMIT } from '@/constants/limit';
import PageHeading from '@/components/Common/PageHeading';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import { getApiSearchUrl } from '@/config/publicEnv';
import { APP_WEBVIEW_QUERY_PARAMETER, APP_WEBVIEW_QUERY_VALUE } from '@/hooks/useAppWebViewMode';
import { fieldControlClassName, pillControlClassName } from '@/components/Common/controlClassNames';
import { colorClassNames } from '@/styles/designTokens';

type Props = {
  recentArticles?: UnifiedArticle[];
  tags: Tag[];
  archiveList: ArchiveItem[];
};

type SearchResponse = {
  contents?: SearchArticlePayload[];
  totalCount?: number;
};

type SearchArticlePayload = Partial<UnifiedArticle> & {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  publishedAt?: unknown;
  updatedAt?: unknown;
  url?: unknown;
  source?: unknown;
};

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

type SearchState = {
  articles: UnifiedArticle[];
  currentPage: number;
  query: string;
  status: SearchStatus;
  totalCount: number;
};

const initialSearchState: SearchState = {
  articles: [],
  currentPage: 1,
  query: '',
  status: 'idle',
  totalCount: 0,
};

const getCurrentPage = (page: string | null) => {
  const parsedPage = Number(page);

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

const getSearchUrl = (endpoint: string, query: string, currentPage: number) => {
  const baseUrl = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
  const url = new URL(endpoint, baseUrl);

  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(LIMIT));
  url.searchParams.set('offset', String((currentPage - 1) * LIMIT));

  return url.toString();
};

const getPayloadString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const normalizeSearchArticle = (article: SearchArticlePayload): UnifiedArticle | null => {
  const rawId = getPayloadString(article.id);
  const title = getPayloadString(article.title);

  if (!rawId || !title) {
    return null;
  }

  const source = article.source === 'zenn' ? 'zenn' : 'blog';
  const contentId = source === 'blog' && rawId.startsWith('blog-') ? rawId.slice(5) : rawId;
  const normalizedId = source === 'blog' && !rawId.startsWith('blog-') ? `blog-${rawId}` : rawId;
  const fallbackUrl = source === 'blog' ? `/articles/${contentId}` : '';
  const url = getPayloadString(article.url) || fallbackUrl;

  if (!url) {
    return null;
  }

  return {
    id: normalizedId,
    title,
    description: getPayloadString(article.description),
    publishedAt: getPayloadString(article.publishedAt) || getPayloadString(article.updatedAt),
    updatedAt: getPayloadString(article.updatedAt) || undefined,
    thumbnail: article.thumbnail,
    thumbnailUrl: article.thumbnailUrl,
    url,
    source,
  };
};

const normalizeSearchArticles = (contents: SearchResponse['contents']) => {
  if (!Array.isArray(contents)) {
    return [];
  }

  return contents.flatMap((article) => {
    const normalizedArticle = normalizeSearchArticle(article);
    return normalizedArticle ? [normalizedArticle] : [];
  });
};

function AppSearchIndex({ tags, archiveList }: Pick<Props, 'tags' | 'archiveList'>) {
  const [selectedArchive, setSelectedArchive] = useState('');

  const handleArchiveChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedArchive(value);

    if (value) {
      window.location.href = `/archive/${value}?app=1`;
    }
  };

  return (
    <div className="pb-4" data-app-search-index>
      <label
        htmlFor="app-search-archive"
        className={`mb-2 flex items-center text-sm font-semibold ${colorClassNames.mutedText}`}
      >
        <CalendarDaysIcon className="mr-2 h-5 w-5" aria-hidden="true" />
        アーカイブ
      </label>
      <select
        id="app-search-archive"
        value={selectedArchive}
        onChange={handleArchiveChange}
        className={`${fieldControlClassName} h-11 w-full bg-white px-3 text-base ${colorClassNames.mutedText}`}
      >
        <option value="">アーカイブを選択</option>
        {archiveList.map((item) => {
          const value = `${item.year}/${item.month.padStart(2, '0')}`;

          return (
            <option key={value} value={value}>
              {`${item.year}年${Number(item.month)}月`}
            </option>
          );
        })}
      </select>

      <div
        className={`mb-3 mt-5 flex items-center text-sm font-semibold ${colorClassNames.mutedText}`}
      >
        <HashtagIcon className="mr-2 h-5 w-5" aria-hidden="true" />
        タグ
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <a
            key={tag.id}
            href={`/tag/${tag.id}?app=1`}
            className={`${pillControlClassName} inline-block rounded-full px-3 py-1 text-sm font-semibold`}
          >
            {tag.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage({ recentArticles, tags, archiveList }: Props) {
  const searchParams = useSearchParams();
  const hasAppWebViewParam =
    searchParams.get(APP_WEBVIEW_QUERY_PARAMETER) === APP_WEBVIEW_QUERY_VALUE;
  const query = useMemo(() => searchParams.get('q')?.trim() ?? '', [searchParams]);
  const currentPage = useMemo(() => getCurrentPage(searchParams.get('page')), [searchParams]);
  const [searchState, setSearchState] = useState<SearchState>(initialSearchState);

  useEffect(() => {
    if (!query) {
      return;
    }

    const abortController = new AbortController();

    const searchArticles = async () => {
      const endpoint = getApiSearchUrl();

      if (!endpoint) {
        setSearchState({
          articles: [],
          currentPage,
          query,
          status: 'error',
          totalCount: 0,
        });
        return;
      }

      setSearchState({
        articles: [],
        currentPage,
        query,
        status: 'loading',
        totalCount: 0,
      });

      try {
        const response = await fetch(getSearchUrl(endpoint, query, currentPage), {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data = (await response.json()) as SearchResponse;
        const contents = normalizeSearchArticles(data.contents);

        setSearchState({
          articles: contents,
          currentPage,
          query,
          status: 'success',
          totalCount: typeof data.totalCount === 'number' ? data.totalCount : contents.length,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        Sentry.captureException(error, {
          tags: {
            feature: 'search',
          },
          extra: {
            currentPage,
            query,
          },
        });

        setSearchState({
          articles: [],
          currentPage,
          query,
          status: 'error',
          totalCount: 0,
        });
      }
    };

    searchArticles();

    return () => abortController.abort();
  }, [query, currentPage]);

  const hasCurrentSearchState =
    Boolean(query) && searchState.query === query && searchState.currentPage === currentPage;
  const articles = hasCurrentSearchState ? searchState.articles : [];
  const totalCount = hasCurrentSearchState ? searchState.totalCount : 0;
  const status = hasCurrentSearchState ? searchState.status : 'idle';
  const isLoading = Boolean(query) && (status === 'idle' || status === 'loading');

  const emptyMessage = '記事はまだありません';

  if (!query && hasAppWebViewParam) {
    return <AppSearchIndex tags={tags} archiveList={archiveList} />;
  }

  return (
    <>
      <PageHeading page={{ type: 'search', searchKeyword: query }} />
      <ArticleList
        articles={[]}
        mixedArticles={articles}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        stackedPagination={
          <Pagination
            totalCount={totalCount}
            current={currentPage}
            basePath="/search"
            q={query}
            useQueryPage
          />
        }
      />
      <Pagination
        totalCount={totalCount}
        current={currentPage}
        basePath="/search"
        q={query}
        useQueryPage
        hideWhenStacked
      />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
