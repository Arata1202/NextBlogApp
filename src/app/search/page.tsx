import { Suspense } from 'react';
import SearchPage, { AppSearchIndex } from '@/components/Pages/Search';
import PageHeading from '@/components/Common/PageHeading';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

type SearchParams = {
  app?: string | string[];
  q?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

type SearchPageShellProps = Awaited<ReturnType<typeof getSearchPageData>> & {
  showAppSearchIndex: boolean;
};

async function getSearchPageData() {
  return getSidebarData();
}

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

function SearchPageShell({
  recentArticles,
  tags,
  archiveList,
  showAppSearchIndex,
}: SearchPageShellProps) {
  if (showAppSearchIndex) {
    return <AppSearchIndex tags={tags} archiveList={archiveList} />;
  }

  return (
    <>
      <PageHeading page={{ type: 'search' }} isLoading />
      <ArticleList
        articles={[]}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
        isLoading
      />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}

export default async function Page({ searchParams }: Props) {
  const [searchPageData, resolvedSearchParams] = await Promise.all([
    getSearchPageData(),
    searchParams,
  ]);
  const showAppSearchIndex =
    getFirstSearchParam(resolvedSearchParams.app) === '1' &&
    getFirstSearchParam(resolvedSearchParams.q).trim() === '';

  return (
    <Suspense
      fallback={<SearchPageShell {...searchPageData} showAppSearchIndex={showAppSearchIndex} />}
    >
      <SearchPage {...searchPageData} />
    </Suspense>
  );
}
