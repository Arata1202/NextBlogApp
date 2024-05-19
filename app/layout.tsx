import { SpeedInsights } from '@vercel/speed-insights/next';
import { getTagList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import styles from './layout.module.css';

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'リアル大学生',
  description: '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。',
  openGraph: {
    title: 'リアル大学生',
    description: '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。',
    images: '/images/thumbnail/7.webp',
    url: 'https://realunivlog.vercel.app',
  },
  // alternates: {
  //   canonical: '/',
  // },
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const tags = await getTagList({
    limit: LIMIT,
  });
  return (
    <html lang="ja">
      <head>
        {/* 共通 */}
        <meta name="format-detection" content="email=no,telephone=no,address=no" />
        {/* 共通 PWA */}
        <link rel="manifest" href="/manifest.json" />
        {/* 共通 ファビコン */}
        <link
          rel="icon"
          href="https://realunivlog.vercel.app/images/head/16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="https://realunivlog.vercel.app/images/head/32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="https://realunivlog.vercel.app/images/head/48.png"
          sizes="48x48"
          type="image/png"
        />
        {/* 共通 Appleアイコン */}
        <link
          rel="apple-touch-icon"
          href="https://realunivlog.vercel.app/images/head/realstudent.png"
        />
        {/* 共通 Windows用アイコン */}
        <meta
          name="msapplication-TileImage"
          content="https://realunivlog.vercel.app/images/head/realstudent512.png"
        />
        <meta name="msapplication-TileColor" content="#E0CBBA" />
        {/* 共通 Twitter用 */}
        <meta property="og:type" content="blog" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@Aokumoblog" />
        <meta name="twitter:site" content="@Aokumoblog" />
        <meta property="og:site_name" content="リアル大学生" />
        <meta property="og:locale" content="ja_JP" />
      </head>
      <body>
        <Header />
        {/* <Nav tags={tags.contents} /> */}
        <main className={styles.main}>{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
