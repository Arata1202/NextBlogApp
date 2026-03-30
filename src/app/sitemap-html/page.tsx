import { getAllLists, getAllCategoryLists, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import SitemapHtmlPage from '@/components/Pages/SitemapHtml';
import { getMixedRecentArticles } from '@/libs/recent';

export const revalidate = 60;

export default async function Page() {
  const data = await getAllLists({
    fields: 'id,title,thumbnail',
  });
  const categories = await getAllCategoryLists({
    fields: 'id,name',
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const archiveList = await getArchiveList();
  const recentArticles = await getMixedRecentArticles();

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
