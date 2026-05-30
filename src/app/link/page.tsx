import LinkPage from '@/components/Pages/Link';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

export default async function Page() {
  const { recentArticles, tags, archiveList } = await getSidebarData();

  return (
    <>
      <LinkPage recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
    </>
  );
}
