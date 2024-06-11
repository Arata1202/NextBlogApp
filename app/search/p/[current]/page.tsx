import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import TopSidebar from '@/components/TopSidebar';
import { MagnifyingGlassIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';

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
      <h1 className="categoryTitle text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div>
                <div>
                  <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                </div>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <div className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  キーワードで探す
                </div>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center pb-2 pt-2 mt-5">
          <MagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>キーワードで探す</div>
        </div>
      </h1>
      <ArticleList articles={data.contents} />
      <Pagination
        totalCount={data.totalCount}
        current={current}
        basePath="/search"
        q={searchParams.q}
      />
      <div className="pc">
        <TopSidebar articles={data2.contents} />
      </div>
    </>
  );
}
