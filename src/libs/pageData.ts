import { ZENN_USER_ID } from '@/constants/data';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import { getZennFeed } from '@/libs/zenn';
import { mapBlogArticlesToUnified, mixUnifiedArticles } from '@/libs/unified';
import { cache } from 'react';
import { getAllLists, getAllTagLists } from '@/libs/microcms';
import { buildArchiveList, getArchiveList } from '@/libs/archive';
import { getMixedRecentArticles } from '@/libs/recent';

export const getSidebarNavigationData = cache(async () => {
  const [tags, archiveList] = await Promise.all([
    getAllTagLists({
      fields: 'id,name',
    }),
    getArchiveList(),
  ]);

  return { tags, archiveList };
});

export const getSidebarData = cache(async () => {
  const [recentArticles, navigationData] = await Promise.all([
    getMixedRecentArticles(),
    getSidebarNavigationData(),
  ]);
  const { tags, archiveList } = navigationData;

  return { recentArticles, tags, archiveList };
});

export const getHomeCollection = cache(async () => {
  const [blogArticles, zennArticles] = await Promise.all([
    getAllLists({ fields: 'id,title,description,thumbnail,publishedAt,updatedAt' }),
    getZennFeed(ZENN_USER_ID, undefined, { includeAll: true, required: true }),
  ]);
  return {
    articles: mixUnifiedArticles(mapBlogArticlesToUnified(blogArticles), zennArticles),
    archiveList: buildArchiveList(blogArticles),
  };
});

export const getHomePageData = async (current: number) => {
  const [{ articles, archiveList }, tags] = await Promise.all([
    getHomeCollection(),
    getAllTagLists({ fields: 'id,name' }),
  ]);
  const offset = (current - 1) * LIMIT;

  return {
    archiveList,
    tags,
    mixedArticles: articles.slice(offset, offset + LIMIT),
    recentArticles: articles.slice(0, RECENT_LIMIT),
    totalCount: articles.length,
  };
};
