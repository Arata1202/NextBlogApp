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
      <SitemapPage sidebarArticles={{ contents: data }} />
      <div className="pc">
        <Sidebar articles={data} />
      </div>
    </>
  );
}
