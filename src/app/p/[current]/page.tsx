import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants/limit';
import HomePage from '@/components/Pages/Home';
import { getSidebarData } from '@/libs/pageData';

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

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const data = await getList({
    limit: 0,
    fields: '',
  });

  const totalCount = data.totalCount;
  const totalPages = Math.ceil(totalCount / LIMIT);
  const currents = Array.from({ length: totalPages }, (_, i) => i + 1);

  return currents.map((current) => ({ current: current.toString() }));
};

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);

  const [data, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      offset: LIMIT * (current - 1),
    }),
    getSidebarData(),
  ]);
  const { recentArticles, tags, archiveList } = sidebarData;

  return (
    <>
      <HomePage
        articles={data.contents}
        totalCount={data.totalCount}
        current={current}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
