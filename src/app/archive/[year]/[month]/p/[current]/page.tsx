import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Layouts/Pagination';
import ArticleList from '@/components/ArticleLists/ArticleList';
import TopSidebar from '@/components/Sidebars/TopSidebar';
import Display from '@/components/Adsense/Display';

type Props = {
  params: Promise<{
    current: string;
    year: string;
    month: string;
  }>;
};

export const metadata = {
  robots: {
    index: false,
  },
};

export const revalidate = 60;

export default async function Page(props: Props) {
  const params = await props.params;
  const { year, month } = params;
  const startDate = `${year}-${month}-01T00:00:00Z`;
  const endDate = new Date(Number(year), Number(month), 1).toISOString();
  const current = parseInt(params.current as string, 10);
  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
    filters: `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`,
  });
  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination
        totalCount={data.totalCount}
        current={current}
        basePath={`/archive/${year}/${month}`}
      />
      <div className="pc">
        <TopSidebar />
      </div>
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
