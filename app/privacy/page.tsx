import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import PrivacyPage from '@/components/Fixed/privacy';

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'プライバシーポリシー・免責事項｜リアル大学生',
  description: 'プライバシーポリシーと免責事項を記載しています。',
  openGraph: {
    title: 'プライバシーポリシー・免責事項｜リアル大学生',
    description: 'プライバシーポリシーと免責事項を記載しています。',
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
      <PrivacyPage />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
