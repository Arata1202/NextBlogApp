import { getAllLists, getAllCategoryLists, getAllTagLists } from '@/libs/microcms';
import SitemapHtmlPage from '@/components/Pages/SitemapHtml';

export const revalidate = 60;

export default async function Page() {
  const data = await getAllLists({
    fields: 'id,title',
  });
  const categories = await getAllCategoryLists({
    fields: 'id,name',
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });

  return (
    <>
      <SitemapHtmlPage articles={data} categories={categories} tags={tags} />
    </>
  );
}
