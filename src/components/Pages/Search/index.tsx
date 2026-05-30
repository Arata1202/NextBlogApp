'use client';

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
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState<SearchStatus>('idle');

  useEffect(() => {
    if (!query) {
      setArticles([]);
      setTotalCount(0);
      setStatus('idle');
      return;
    }

    const endpoint = getApiSearchUrl();
    if (!endpoint) {
      setArticles([]);
      setTotalCount(0);
      setStatus('error');
      return;
    }

    const abortController = new AbortController();

    const searchArticles = async () => {
      setArticles([]);
      setTotalCount(0);
      setStatus('loading');

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

        setArticles(contents);
        setTotalCount(typeof data.totalCount === 'number' ? data.totalCount : contents.length);
        setStatus('success');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setArticles([]);
        setTotalCount(0);
        setStatus('error');
      }
    };

    searchArticles();

    return () => abortController.abort();
  }, [query, currentPage]);

  const isLoading = Boolean(query) && (status === 'idle' || status === 'loading');

  const emptyMessage = '記事はまだありません';

  return (
    <>
      <PageHeading search searchKeyword={query} />
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
