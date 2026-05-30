import ProfilePage from '@/components/Pages/Profile';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

export default async function Page() {
  const { recentArticles, tags, archiveList } = await getSidebarData();

  return (
    <>
      <ProfilePage recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
    </>
  );
}
