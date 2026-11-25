import { getList, getAllTagLists } from '@/libs/microcms';
import { LIMIT } from '@/constants/limit';
import TagPage from '@/components/Pages/Tag';
import { getTagForPage, taxonomyFields } from '@/libs/microcmsPage';
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

  const results: { tagId: string; current: string }[] = [];
  for (const { id } of tags) {
    const { totalCount } = await getList({
      limit: 0,
      fields: '',
      filters: `tags[contains]${id}`,
    });
    for (let current = 1; current <= Math.ceil(totalCount / LIMIT); current++) {
      results.push({ tagId: id, current: String(current) });
    }
  }
  return results;
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
    getTagForPage(params.tagId, taxonomyFields),
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
