import Sidebar from '@/components/Sidebar';
import ProfilePage from '@/components/Fixed/profile';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';

export const metadata = {
  // 検証OK
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'プロフィール｜リアル大学生',
  description: '筆者のプロフィールを紹介しています。',
  openGraph: {
    title: 'プロフィール｜リアル大学生',
    description: '筆者のプロフィールを紹介しています。',
    images: '/images/thumbnail/2.webp',
    url: 'https://realunivlog.vercel.app/profile',
  },
  // noindex不要

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
      <ProfilePage sidebarArticles={data} />
      <div className="pc">
        <Sidebar articles={data.contents} />
      </div>
    </>
  );
}
