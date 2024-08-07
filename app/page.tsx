import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import TopSidebar from '@/components/TopSidebar';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import Display from '@/components/Adsense/display';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });

  return (
    <>
      <h1 className="categoryTitle text-3xl font-bold pt-5 pb-2 max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="topTitle flex items-center pb-2 pt-2 mt-10">
          <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>最新記事</div>
        </div>
      </h1>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} />
      <div className="pc">
        <TopSidebar articles={data.contents} />
      </div>
      <Display slot="5969933704" />
    </>
  );
}
