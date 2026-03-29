import { getList, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import HomePage from '@/components/Pages/Home';
import { getZennFeed } from '@/libs/zenn';
import { UnifiedArticle } from '@/types/unified';

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const archiveList = await getArchiveList();
  const zennArticles = await getZennFeed('realunivlog', LIMIT);

  const blogArticles: UnifiedArticle[] = data.contents.map((item) => ({
    id: `blog-${item.id}`,
    title: item.title,
    description: item.description,
    publishedAt: item.publishedAt!,
    updatedAt: item.updatedAt,
    thumbnailUrl: item.thumbnail?.url,
    url: `/articles/${item.id}`,
    source: 'blog',
  }));

  const mixedArticles = [...blogArticles, ...zennArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, LIMIT);

  return (
    <>
      <HomePage
        articles={data.contents}
        mixedArticles={mixedArticles}
        totalCount={data.totalCount}
        recentArticles={recentArticles.contents}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
