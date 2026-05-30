import { Suspense } from 'react';
import SearchPage from '@/components/Pages/Search';
import PageHeading from '@/components/Common/PageHeading';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

type SearchPageShellProps = Awaited<ReturnType<typeof getSearchPageData>>;

async function getSearchPageData() {
  return getSidebarData();
}

function SearchPageShell({ recentArticles, tags, archiveList }: SearchPageShellProps) {
  return (
    <>
      <PageHeading page={{ type: 'search' }} />
      <ArticleList
        articles={[]}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
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
