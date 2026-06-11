import { getList, getAllTagLists } from '@/libs/microcms';
import { LIMIT } from '@/constants/limit';
import TagPage from '@/components/Pages/Tag';
import { getTagForPage } from '@/libs/microcmsPage';
import { getSidebarData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    tagId: string;
    current: string;
  }>;
};

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const tags = await getAllTagLists({
    fields: 'id',
  });

  const results = await Promise.all(
    tags.map(async (tag) => {
      const tagId = tag.id;

      const data = await getList({
        limit: 0,
        fields: '',
        filters: `tags[contains]${tagId}`,
      });

      const totalCount = data.totalCount;
      const totalPages = Math.ceil(totalCount / LIMIT);
      const currents = Array.from({ length: totalPages }, (_, i) => i + 1);

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

  const [data, tag, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      offset: LIMIT * (current - 1),
      filters: `tags[contains]${tagId}`,
    }),
    getTagForPage(params.tagId, { fields: 'id,name' }),
    getSidebarData(),
  ]);
  const { recentArticles, tags, archiveList } = sidebarData;

  return (
    <>
      <TagPage
        articles={data.contents}
        tag={tag}
        current={current}
        totalCount={data.totalCount}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
