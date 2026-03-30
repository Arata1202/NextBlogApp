import { getList, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import HomePage from '@/components/Pages/Home';
import { getZennFeed } from '@/libs/zenn';
import { mapBlogArticlesToUnified, mixUnifiedArticles } from '@/libs/unified';

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const archiveList = await getArchiveList();
  const zennArticles = await getZennFeed('realunivlog', LIMIT);

  const blogArticles = mapBlogArticlesToUnified(data.contents);
  const mixedArticles = mixUnifiedArticles(blogArticles, zennArticles, LIMIT);
  const recentArticles = mixedArticles.slice(0, RECENT_LIMIT);

  return (
    <>
      <HomePage
        articles={data.contents}
        mixedArticles={mixedArticles}
        totalCount={data.totalCount}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
