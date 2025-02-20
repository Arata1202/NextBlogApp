import { getList, getAllLists, getTag } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import TagPage from '@/components/Pages/Tag';

type Props = {
  params: Promise<{
    tagId: string;
    current: string;
  }>;
};

export const revalidate = 60;

export default async function Page(props: Props) {
  const params = await props.params;
  const { tagId } = params;

  const current = parseInt(params.current as string, 10);

  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
    filters: `tags[contains]${tagId}`,
  });
  const allData = await getAllLists();
  const tag = await getTag(params.tagId);

  return (
    <>
      <TagPage
        articles={data.contents}
        tag={tag}
        current={current}
        totalCount={data.totalCount}
        allArticles={allData}
      />
    </>
  );
}
