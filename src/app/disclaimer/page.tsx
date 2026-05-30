import DisclaimerPage from '@/components/Pages/Disclaimer';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

export default async function Page() {
  const { recentArticles, tags, archiveList } = await getSidebarData();

  return (
    <>
      <DisclaimerPage recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
    </>
  );
}
