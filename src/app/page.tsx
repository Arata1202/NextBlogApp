import { getList } from '@/libs/Microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants/Limit';
import HomePage from '@/components/Pages/Home';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <HomePage
        articles={data.contents}
        totalCount={data.totalCount}
        recentArticles={recentArticles.contents}
      />
    </>
  );
}
