import { getList, getTag } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import Sidebar from '@/components/Sidebar';

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
    filters: `tags[contains]${tagId}`,
  });
  const data2 = await getList({
    limit: LIMIT,
  });
  const tag = await getTag(tagId);
  return (
    <>
      <ArticleList articles={data.contents} allArticles={data2.contents} />
      <div className="pc">
        <Sidebar articles={data2.contents} />
      </div>
      <Pagination totalCount={data.totalCount} basePath={`/category/${tagId}`} />
    </>
  );
}
