import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import ProfilePage from '@/components/Fixed/profile';

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'プロフィール｜リアル大学生',
  description: '筆者のプロフィールを紹介しています。',
  openGraph: {
    title: 'プロフィール｜リアル大学生',
    description: '筆者のプロフィールを紹介しています。',
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
      <ProfilePage />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
