import { ZENN_ACCOUNT } from '@/constants/zenn';
import { getList } from '@/libs/microcms';
import { getZennFeed } from '@/libs/zenn';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import { mixUnifiedArticles, mapBlogArticlesToUnified } from '@/libs/unified';

export const getMixedRecentArticles = async (
  limit: number = RECENT_LIMIT,
  sourceLimit: number = LIMIT,
) => {
  const [blogList, zennArticles] = await Promise.all([
    getList({
      limit: sourceLimit,
      orders: '-publishedAt',
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    }).catch((error: unknown) => {
      console.warn('Recent blog articles unavailable', error);
      return { contents: [] };
    }),
    getZennFeed(ZENN_ACCOUNT, sourceLimit),
  ]);

  const blogArticles = mapBlogArticlesToUnified(blogList.contents);
  return mixUnifiedArticles(blogArticles, zennArticles, limit);
};
