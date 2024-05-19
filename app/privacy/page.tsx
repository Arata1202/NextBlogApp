import Sidebar from '@/components/Sidebar';
import PrivacyPage from '@/components/Fixed/privacy';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'プライバシーポリシー・免責事項｜リアル大学生',
  description: 'プライバシーポリシーと免責事項を記載しています。',
  openGraph: {
    title: 'プライバシーポリシー・免責事項｜リアル大学生',
    description: 'プライバシーポリシーと免責事項を記載しています。',
    images: '/images/thumbnail/4.webp',
    url: 'https://realunivlog.vercel.app/privacy',
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
      <PrivacyPage sidebarArticles={data} />
      <div className="pc">
        <Sidebar articles={data.contents} />
      </div>
    </>
  );
}
