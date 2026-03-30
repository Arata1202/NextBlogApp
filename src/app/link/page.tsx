import LinkPage from '@/components/Pages/Link';
import { getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { getMixedRecentArticles } from '@/libs/recent';

export const revalidate = 60;

export default async function Page() {
  const recentArticles = await getMixedRecentArticles();
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const archiveList = await getArchiveList();

  return (
    <>
      <LinkPage recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
    </>
  );
}
