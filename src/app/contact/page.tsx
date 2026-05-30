import ContactPage from '@/components/Pages/Contact';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

export default async function Page() {
  const { recentArticles, tags, archiveList } = await getSidebarData();

  return (
    <>
      <ContactPage recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
    </>
  );
}
