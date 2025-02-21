import { getList } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants';
import HomePage from '@/components/Pages/Home';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
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
