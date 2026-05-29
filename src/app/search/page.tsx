import { Suspense } from 'react';
import { getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { getMixedRecentArticles } from '@/libs/recent';
import SearchPage from '@/components/Pages/Search';
import PageHeading from '@/components/Common/PageHeading';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';

export const revalidate = 60;

type SearchPageShellProps = Awaited<ReturnType<typeof getSearchPageData>>;

async function getSearchPageData() {
  const [recentArticles, tags, archiveList] = await Promise.all([
    getMixedRecentArticles(),
    getAllTagLists({
      fields: 'id,name',
    }),
    getArchiveList(),
  ]);

  return { recentArticles, tags, archiveList };
}

function SearchPageShell({ recentArticles, tags, archiveList }: SearchPageShellProps) {
  return (
    <>
      <PageHeading search />
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
