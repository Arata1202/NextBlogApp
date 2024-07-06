import FixedSidebar from '@/components/FixedSidebar';
import ProfilePage from '@/components/Fixed/profile';
import { UserCircleIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Display from '@/components/Adsense/display';

export const metadata = {
  // 検証OK
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'プロフィール｜リアル大学生',
  description: '筆者のプロフィールを紹介しています。',
  openGraph: {
    title: 'プロフィール｜リアル大学生',
    description: '筆者のプロフィールを紹介しています。',
    images: '/images/thumbnail/2.webp',
    url: 'https://realunivlog.com/profile',
  },
  alternates: {
    canonical: 'https://realunivlog.com/profile',
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
                  href="/profile"
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
                >
                  プロフィール
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center py-2 mt-5">
          <UserCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <h1 className="text-3xl font-bold lg:text-3xl">プロフィール</h1>
        </div>
      </h1>
      <ProfilePage sidebarArticles={data} />
      <div className="pc">
        <FixedSidebar articles={data.contents} />
      </div>
      <Display slot="5969933704" />
    </>
  );
}
