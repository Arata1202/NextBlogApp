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
  // 検証済み
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'リアル大学生',
  description: '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。',
  openGraph: {
    title: 'リアル大学生',
    description: '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。',
    images: '/images/thumbnail/7.webp',
    url: 'https://realunivlog.com',
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
      <div className="pc">
        <Sidebar articles={data2.contents} />
      </div>
      <Pagination
        totalCount={data.totalCount}
        current={current}
        basePath="/search"
        q={searchParams.q}
      />
    </>
  );
}
