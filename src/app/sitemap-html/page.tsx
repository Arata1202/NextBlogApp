import { getAllLists, getAllCategoryLists } from '@/libs/microcms';
import SitemapHtmlPage from '@/components/Pages/SitemapHtml';
import { getSidebarData } from '@/libs/pageData';

export const revalidate = 60;

export default async function Page() {
  const [data, categories, sidebarData] = await Promise.all([
    getAllLists({
      fields: 'id,title,thumbnail',
    }),
    getAllCategoryLists({
      fields: 'id,name',
    }),
    getSidebarData(),
  ]);
  const { recentArticles, tags, archiveList } = sidebarData;

  return (
    <>
      <SitemapHtmlPage
        articles={data}
        recentArticles={recentArticles}
        categories={categories}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
