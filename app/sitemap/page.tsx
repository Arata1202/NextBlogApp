import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import SitemapPage from '@/components/Fixed/sitemap';

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

export default async function Page() {
  const data = await getList({
    limit: 100,
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
