import { getAllLists, getAllCategoryLists, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { getYouTubeList } from '@/libs/youtube';
import SitemapHtmlPage from '@/components/Pages/SitemapHtml';

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
  const youtubeList = await getYouTubeList();

  return (
    <>
      <SitemapHtmlPage
        articles={data}
        categories={categories}
        tags={tags}
        archiveList={archiveList}
        youtubeList={youtubeList}
      />
    </>
  );
}
