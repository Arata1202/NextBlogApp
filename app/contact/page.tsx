import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import ContactPage from '@/components/Fixed/contact';

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'お問い合わせ｜リアル大学生',
  description: 'お問い合わせのフォームを記載しています。',
  openGraph: {
    title: 'お問い合わせ｜リアル大学生',
    description: 'お問い合わせのフォームを記載しています。',
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
      <ContactPage />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
