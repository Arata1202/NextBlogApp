import { getList } from '@/libs/microcms';
import FixedSidebar from '@/components/FixedSidebar';
import SitemapPage from '@/components/Fixed/sitemap';
import { DocumentMagnifyingGlassIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Display from '@/components/Adsense/display';

export const metadata = {
  // 検証済み
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'サイトマップ｜リアル大学生',
  description: '当ブログのサイトマップを記載しています。',
  openGraph: {
    title: 'サイトマップ｜リアル大学生',
    description: '当ブログのサイトマップを記載しています。',
    images: '/images/thumbnail/3.webp',
    url: 'https://realunivlog.com/sitemap',
  },
  alternates: {
    canonical: 'https://realunivlog.com/sitemap',
  },
};

export const revalidate = 60;

async function fetchAllData(limit = 100): Promise<any[]> {
  let offset = 0;
  let allData: any[] = [];
  let response;
  let loopCount = 0;

  do {
    response = await getList({ limit, offset });
    if (response && response.contents) {
      allData = [...allData, ...response.contents];
    }
    loopCount++;
    offset += limit;
  } while (response && response.contents && response.contents.length === limit);
  return allData;
}

export default async function Page() {
  const data = await fetchAllData();

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
                <a
                  href="/sitemap"
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
                >
                  サイトマップ
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center py-2 mt-5">
          <DocumentMagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <h1 className="text-3xl font-bold lg:text-3xl">サイトマップ</h1>
        </div>
      </h1>
      <SitemapPage sidebarArticles={{ contents: data }} />
      <div className="pc">
        <FixedSidebar articles={data} />
      </div>
      <Display slot="5969933704" />
    </>
  );
}
