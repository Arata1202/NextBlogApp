import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Layouts/Pagination';
import ArticleList from '@/components/ArticleList';
import TopSidebar from '@/components/Sidebars/TopSidebar';
import Display from '@/components/Adsense/display';

type Props = {
  params: {
    year: string;
    month: string;
  };
};

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { year, month } = params;

  const startDate = `${year}-${month}-01T00:00:00Z`;
  const endDate = new Date(Number(year), Number(month), 0).toISOString();

  const data = await getList({
    limit: LIMIT,
    filters: `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`,
  });

  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} basePath={`/archive/${year}/${month}`} />
      <div className="pc">
        <TopSidebar />
      </div>
      <Display slot="5969933704" />
    </>
  );
}
