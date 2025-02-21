import { getList, getTag } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants';
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
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
  });
  const tag = await getTag(params.tagId);

  return (
    <>
      <TagPage
        articles={data.contents}
        tag={tag}
        totalCount={data.totalCount}
        recentArticles={recentArticles.contents}
      />
    </>
  );
}
