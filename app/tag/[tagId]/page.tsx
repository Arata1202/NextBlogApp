import { getList, getTag2 } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import TopSidebar from '@/components/TopSidebar';
import Display from '@/components/Adsense/display';

type Props = {
  params: {
    tagId: string;
  };
};

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { tagId } = params;
  const data = await getList({
    limit: LIMIT,
    filters: `tags2[contains]${tagId}`,
  });
  const data2 = await getList({
    limit: LIMIT,
  });
  const tag = await getTag2(tagId);
  return (
    <>
      <ArticleList articles={data.contents} allArticles={data2.contents} />
      <Pagination totalCount={data.totalCount} basePath={`/tag/${tagId}`} />
      <div className="pc">
        <TopSidebar articles={data2.contents} />
      </div>
      <Display slot="5969933704" />
    </>
  );
}
