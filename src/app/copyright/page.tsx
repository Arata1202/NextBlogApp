import CopyrightPage from '@/components/Pages/Copyright';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

export default async function Page() {
  const { recentArticles, tags, archiveList } = await getSidebarData();

  return (
    <>
      <CopyrightPage recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
    </>
  );
}
