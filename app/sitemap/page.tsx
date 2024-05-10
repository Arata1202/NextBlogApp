import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import SitemapPage from '@/components/Fixed/sitemap';

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
  return (
    <>
      <SitemapPage />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
