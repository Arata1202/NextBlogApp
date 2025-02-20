import { getList, getTag, getAllLists } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import TagPage from '@/components/Pages/Tag';

type Props = {
  params: Promise<{
    tagId: string;
  }>;
};

export const revalidate = 60;

export default async function Page(props: Props) {
  const params = await props.params;
  const { tagId } = params;

  const data = await getList({
    limit: LIMIT,
    filters: `tags[contains]${tagId}`,
  });
  const allData = await getAllLists();
  const tag = await getTag(params.tagId);

  return (
    <>
      <TagPage
        articles={data.contents}
        tag={tag}
        totalCount={data.totalCount}
        allArticles={allData}
      />
    </>
  );
}
