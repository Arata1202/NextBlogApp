import { getList } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants';
import HomePage from '@/components/Pages/Home';

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export const metadata = {
  robots: {
    index: false,
  },
};

export const revalidate = 60;

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);

  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
  });

  return (
    <>
      <HomePage
        articles={data.contents}
        totalCount={data.totalCount}
        current={current}
        recentArticles={recentArticles.contents}
      />
    </>
  );
}
