import { Suspense } from 'react';
import SearchPage, { AppSearchIndex } from '@/components/Pages/Search';
import PageHeading from '@/components/Common/PageHeading';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import { getSidebarData } from '@/libs/pageData';
import styles from './page.module.css';

export const revalidate = 60;

type SearchPageShellProps = Awaited<ReturnType<typeof getSearchPageData>>;

async function getSearchPageData() {
  return getSidebarData();
}

function SearchPageShell({ recentArticles, tags, archiveList }: SearchPageShellProps) {
  return (
    <>
      <div className={styles.appSearchIndexFallback} data-app-search-index-fallback>
        <AppSearchIndex tags={tags} archiveList={archiveList} />
      </div>
      <div className={styles.loadingFallback} data-search-loading-fallback>
        <PageHeading page={{ type: 'search' }} isLoading />
        <ArticleList
          articles={[]}
          recentArticles={recentArticles}
          tags={tags}
          archiveList={archiveList}
          isLoading
        />
        <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
      </div>
    </>
  );
}

export default async function Page() {
  const searchPageData = await getSearchPageData();

  return (
    <Suspense fallback={<SearchPageShell {...searchPageData} />}>
      <SearchPage {...searchPageData} />
    </Suspense>
  );
}
