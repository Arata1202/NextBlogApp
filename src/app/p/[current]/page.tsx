import { getList, getAllTagLists } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import HomePage from '@/components/Pages/Home';
import { generateRssFeed } from '@/libs/rss';

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

export const generateStaticParams = async () => {
  generateRssFeed();

  const data = await getList({
    limit: 0,
    fields: '',
  });

  const totalCount = data.totalCount;
  const currents = Array.from({ length: totalCount }, (_, i) => i + 1);

  return currents.map((current) => ({ current: current.toString() }));
};

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);

  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    offset: LIMIT * (current - 1),
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });

  return (
    <>
      <HomePage
        articles={data.contents}
        totalCount={data.totalCount}
        current={current}
        recentArticles={recentArticles.contents}
        tags={tags}
      />
    </>
  );
}
