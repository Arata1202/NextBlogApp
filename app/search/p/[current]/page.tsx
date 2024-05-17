import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import Sidebar from '@/components/Sidebar';

type Props = {
  params: {
    current: string;
  };
  searchParams: {
    q?: string;
  };
};

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'キーワードで探す｜リアル大学生',
  description: 'キーワードで記事を検索するページです。',
  openGraph: {
    title: 'キーワードで探す｜リアル大学生',
    description: 'キーワードで記事を検索するページです。',
    images: '/ogp.webp',
  },
  robots: {
    index: false,
  },
  // alternates: {
  //   canonical: '/',
  // },
};

export const revalidate = 60;

export default async function Page({ params, searchParams }: Props) {
  const current = parseInt(params.current as string, 10);
  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
    q: searchParams.q,
  });
  const data2 = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination
        totalCount={data.totalCount}
        current={current}
        basePath="/search"
        q={searchParams.q}
      />
      <div className="pc">
        <Sidebar articles={data2.contents} />
      </div>
    </>
  );
}
