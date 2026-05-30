import PrivacyPage from '@/components/Pages/Privacy';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

export default async function Page() {
  const { recentArticles, tags, archiveList } = await getSidebarData();

  return (
    <>
      <PrivacyPage recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
    </>
  );
}
