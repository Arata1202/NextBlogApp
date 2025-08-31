import { getList, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import HomePage from '@/components/Pages/Home';

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

  return (
    <>
      <HomePage
        articles={data.contents}
        totalCount={data.totalCount}
        recentArticles={recentArticles.contents}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
