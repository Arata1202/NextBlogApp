import { getList, getTag } from '@/libs/Microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants/Limit';
import TagPage from '@/components/Pages/Tag';
import { TagArray } from '@/constants/Blog/TagArray';

type Props = {
  params: Promise<{
    tagId: string;
  }>;
};

export const generateStaticParams = async () => {
  return TagArray.map((tag) => ({
    tagId: tag.id,
  }));
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { tagId } = params;

  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    filters: `tags[contains]${tagId}`,
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });
  const tag = await getTag(params.tagId, { fields: 'id,name' });

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
