import { getList, getAllTagLists } from '@/libs/microcms';
import { LIMIT } from '@/constants/limit';
import TagPage from '@/components/Pages/Tag';
import { getTagForPage } from '@/libs/microcmsPage';
import { getSidebarData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    tagId: string;
  }>;
};

export const generateStaticParams = async () => {
  const tags = await getAllTagLists({
    fields: 'id',
  });

  return tags.map((tag) => ({
    tagId: tag.id,
  }));
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { tagId } = params;

  const [data, tag, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
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
        totalCount={data.totalCount}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
