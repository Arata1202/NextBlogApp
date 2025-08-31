import { getList, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { RECENT_LIMIT } from '@/constants/limit';
import CopyrightPage from '@/components/Pages/Copyright';

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

  return (
    <>
      <CopyrightPage articles={data.contents} tags={tags} archiveList={archiveList} />
    </>
  );
}
