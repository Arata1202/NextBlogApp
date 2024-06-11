import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import TopSidebar from '@/components/TopSidebar';

type Props = {
  params: {
    tagId: string;
    current: string;
  };
};

export const metadata = {
  robots: {
    index: false,
  },
};

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { tagId } = params;
  const current = parseInt(params.current as string, 10);
  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
    filters: `tags[contains]${tagId}`,
  });
  const data2 = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <ArticleList articles={data.contents} allArticles={data2.contents} />
      <div className="pc">
        <TopSidebar articles={data2.contents} />
      </div>
      <Pagination totalCount={data.totalCount} current={current} basePath={`/category/${tagId}`} />
    </>
  );
}
