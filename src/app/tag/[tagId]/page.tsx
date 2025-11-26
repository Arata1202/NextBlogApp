import { getList, getTag, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { getYouTubeList } from '@/libs/youtube';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import TagPage from '@/components/Pages/Tag';

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

  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    filters: `tags[contains]${tagId}`,
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const tag = await getTag(params.tagId, { fields: 'id,name' });
  const archiveList = await getArchiveList();
  const youtubeList = await getYouTubeList();

  return (
    <>
      <TagPage
        articles={data.contents}
        tag={tag}
        totalCount={data.totalCount}
        recentArticles={recentArticles.contents}
        tags={tags}
        archiveList={archiveList}
        youtubeList={youtubeList}
      />
    </>
  );
}
