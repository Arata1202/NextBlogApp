import FixedSidebar from '@/components/FixedSidebar';
import DisclaimerPage from '@/components/Fixed/disclaimer';
import { ShieldExclamationIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Display from '@/components/Adsense/display';

export const metadata = {
  // 検証OK
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: '免責事項｜リアル大学生',
  description: '免責事項を記載しています。',
  openGraph: {
    title: '免責事項｜リアル大学生',
    description: '免責事項を記載しています。',
    images: '/images/thumbnail/4.webp',
    url: 'https://realunivlog.com/disclaimer',
  },
  alternates: {
    canonical: 'https://realunivlog.com/disclaimer',
  },
};

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
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
                <a
                  href="/disclaimer"
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
                >
                  免責事項
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center py-2 mt-5">
          <ShieldExclamationIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <h1 className="text-3xl font-bold lg:text-3xl">免責事項</h1>
        </div>
      </h1>
      <DisclaimerPage sidebarArticles={data} />
      <div className="pc">
        <FixedSidebar articles={data.contents} />
      </div>
      <Display slot="5969933704" />
    </>
  );
}
