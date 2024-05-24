import Sidebar from '@/components/Sidebar';
import ContactPage from '@/components/Fixed/contact';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';

export const metadata = {
  // 検証 OK
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
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
      <ContactPage sidebarArticles={data} />
      <div className="pc">
        <Sidebar articles={data.contents} />
      </div>
    </>
  );
}
