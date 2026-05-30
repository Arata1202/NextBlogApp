import { cache } from 'react';
import { getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
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
