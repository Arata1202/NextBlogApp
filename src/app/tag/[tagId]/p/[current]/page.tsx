import { getList, getTag } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants/Limit';
import TagPage from '@/components/Pages/Tag';
import { TagObject } from '@/constants/Blog/TagObject';

type Props = {
  params: Promise<{
    tagId: string;
    current: string;
  }>;
};

export const generateStaticParams = async () => {
  const results = await Promise.all(
    TagObject.map(async (tag) => {
      const tagId = tag.id;

      const data = await getList({
        limit: 0,
        fields: '',
        filters: `tags[contains]${tagId}`,
      });

      const totalCount = data.totalCount;
      const currents = Array.from({ length: totalCount }, (_, i) => i + 1);

      return currents.map((current) => ({
        tagId,
        current: current.toString(),
      }));
    }),
  );

  return results.flat();
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { tagId } = params;

  const current = parseInt(params.current as string, 10);

  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    offset: LIMIT * (current - 1),
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
        current={current}
        totalCount={data.totalCount}
        recentArticles={recentArticles.contents}
      />
    </>
  );
}
