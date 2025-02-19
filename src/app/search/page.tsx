import { getList } from '@/libs/microcms';
import ArticleList from '@/components/ArticleLists/ArticleList';
import Pagination from '@/components/Common/Pagination';
import TopSidebar from '@/components/Sidebars/TopSidebar';
import { MagnifyingGlassIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Display from '@/components/Common/Adsense/Display';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
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
};

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const revalidate = 60;

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.q;
  const data = await getList({
    q: searchParams.q,
  });

  return (
    <>
      <h1 className="categoryTitle text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <a href="/" className="flex text-gray-500 hover:text-blue-500">
                <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <div className="ml-4 text-sm font-medium text-gray-500">{`「${keyword}」の検索結果`}</div>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center pb-2 pt-2 mt-5">
          <MagnifyingGlassIcon className="h-8 w-8 mr-2 flex-shrink-0" aria-hidden="true" />
          <div className="whitespace-nowrap overflow-hidden">{`「${keyword}」の検索結果`}</div>
        </div>
      </h1>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} basePath="/search" q={searchParams.q} />
      <div className="pc">
        <TopSidebar />
      </div>
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
