import { getAllLists, getAllCategoryLists } from '@/libs/microcms';
import SitemapHtmlPage from '@/components/Pages/SitemapHtml';

export const revalidate = 60;

export default async function Page() {
  const data = await getAllLists();
  const categories = await getAllCategoryLists();

  return (
    <>
      <SitemapHtmlPage articles={data} categories={categories} />
    </>
  );
}
