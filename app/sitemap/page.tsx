import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import SitemapPage from '@/components/Fixed/sitemap';
import { LIMIT } from '@/constants';

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'サイトマップ｜リアル大学生',
  description: '当ブログのサイトマップを記載しています。',
  openGraph: {
    title: 'サイトマップ｜リアル大学生',
    description: '当ブログのサイトマップを記載しています。',
    images: '/ogp.webp',
  },
  // alternates: {
  //   canonical: '/',
  // },
};

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <SitemapPage sidebarArticles={data} />
      <div className="pc">
        <Sidebar articles={data.contents} />
      </div>
    </>
  );
}
