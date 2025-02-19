import { getAllLists, getAllCategoryLists } from '@/libs/microcms';
import SitemapPage from '@/components/Pages/Sitemap';

export const revalidate = 60;

export default async function Page() {
  const data = await getAllLists();
  const categories = await getAllCategoryLists();

  return (
    <>
      <SitemapPage articles={data} categories={categories} />
    </>
  );
}
