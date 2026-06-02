'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Article, Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { UnifiedArticle } from '@/types/unified';
import { LIMIT } from '@/constants/limit';
import PageHeading from '@/components/Common/PageHeading';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import { getApiSearchUrl } from '@/config/publicEnv';

type Props = {
  recentArticles?: UnifiedArticle[];
  tags: Tag[];
  archiveList: ArchiveItem[];
};

type SearchResponse = {
  contents?: Article[];
  totalCount?: number;
};

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

type SearchState = {
  articles: Article[];
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

export default function SearchPage({ recentArticles, tags, archiveList }: Props) {
  const searchParams = useSearchParams();
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
        const contents = Array.isArray(data.contents) ? data.contents : [];

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

  return (
    <>
      <PageHeading page={{ type: 'search', searchKeyword: query }} />
      <ArticleList
        articles={articles}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
      />
      <Pagination
        totalCount={totalCount}
        current={currentPage}
        basePath="/search"
        q={query}
        useQueryPage
      />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
