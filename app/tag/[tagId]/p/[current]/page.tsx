import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import TopSidebar from '@/components/TopSidebar';
import Script from 'next/script';

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
    filters: `tags2[contains]${tagId}`,
  });
  const data2 = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <ArticleList articles={data.contents} allArticles={data2.contents} />
      <Pagination totalCount={data.totalCount} current={current} basePath={`/tag/${tagId}`} />
      <div className="pc">
        <TopSidebar articles={data2.contents} />
      </div>
    </>
  );
}
