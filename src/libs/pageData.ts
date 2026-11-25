import { cache } from 'react';
import { getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { getMixedRecentArticles } from '@/libs/recent';

async function sidebarItems<T>(label: string, items: Promise<T[]>): Promise<T[]> {
  try {
    return await items;
  } catch (error) {
    console.warn(`Sidebar ${label} unavailable`, error);
    return [];
  }
}

export const getSidebarNavigationData = cache(async () => {
  const [tags, archiveList] = await Promise.all([
    sidebarItems('tags', getAllTagLists({ fields: 'id,name' })),
    sidebarItems('archives', getArchiveList()),
  ]);

  return { tags, archiveList };
});

export const getSidebarData = cache(async () => {
  const [recentArticles, navigationData] = await Promise.all([
    sidebarItems('recent articles', getMixedRecentArticles()),
    getSidebarNavigationData(),
  ]);
  const { tags, archiveList } = navigationData;

  return { recentArticles, tags, archiveList };
});
