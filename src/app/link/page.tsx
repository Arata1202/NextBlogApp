import LinkPage from '@/components/Pages/Link';
import { getList, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { getYouTubeList } from '@/libs/youtube';
import { RECENT_LIMIT } from '@/constants/limit';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const archiveList = await getArchiveList();
  const youtubeList = await getYouTubeList();

  return (
    <>
      <LinkPage
        articles={data.contents}
        tags={tags}
        archiveList={archiveList}
        youtubeList={youtubeList}
      />
    </>
  );
}
