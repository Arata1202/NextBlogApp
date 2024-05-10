import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import Sidebar from '@/components/Sidebar';
import { BellAlertIcon } from '@heroicons/react/24/solid';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <h1 className="categoryTitle text-3xl font-bold pt-5 pb-2 max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center pb-2 pt-2">
          <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>最新記事</div>
        </div>
      </h1>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
