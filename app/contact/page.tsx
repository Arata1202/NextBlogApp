import FixedSidebar from '@/components/Sidebars/FixedSidebar';
import ContactPage from '@/components/Fixed/Contact';
import { EnvelopeIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Display from '@/components/Adsense/Display';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'お問い合わせ｜リアル大学生',
  description: 'お問い合わせのフォームを記載しています。',
  openGraph: {
    title: 'お問い合わせ｜リアル大学生',
    description: 'お問い合わせのフォームを記載しています。',
    images: '/images/thumbnail/1.webp',
    url: 'https://realunivlog.com/contact',
  },
  alternates: {
    canonical: 'https://realunivlog.com/contact',
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
                  href="/contact"
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
                >
                  お問い合わせ
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center py-2 mt-5">
          <EnvelopeIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <h1 className="text-3xl font-bold lg:text-3xl">お問い合わせ</h1>
        </div>
      </h1>
      <ContactPage sidebarArticles={data} />
      <div className="pc">
        <FixedSidebar articles={data.contents} />
      </div>
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
