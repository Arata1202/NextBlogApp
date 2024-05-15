import { getList } from '@/libs/microcms';
import ArticleList from '@/components/ArticleList';
import Pagination from '@/components/Pagination';
import Sidebar from '@/components/Sidebar';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

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

type Props = {
  searchParams: {
    q?: string;
  };
};

export const revalidate = 60;

export default async function Page({ searchParams }: Props) {
  const data = await getList({
    q: searchParams.q,
  });

  return (
    <>
      <h1 className="categoryTitle text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <div className="flex items-center pb-2 pt-2">
          <MagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>キーワードで探す</div>
        </div>
      </h1>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} basePath="/search" q={searchParams.q} />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
