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
    images: '/ogp.webp',
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
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="email=no,telephone=no,address=no" />
        <link
          rel="icon"
          href="https://realunivlog.netlify.app/images/head/16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="https://realunivlog.netlify.app/images/head/32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="https://realunivlog.netlify.app/images/head/48.png"
          sizes="48x48"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="https://realunivlog.netlify.app/images/head/realstudent.png"
        />
        <meta
          name="msapplication-TileImage"
          content="https://realunivlog.netlify.app/images/head/realstudent512.png"
        />
        <meta name="msapplication-TileColor" content="#F0F0F0" />
        <meta property="og:url" content="https://realunivlog.netlify.app" />
        <meta property="og:type" content="blog" />
        <meta
          property="og:image"
          content="https://realunivlog.netlify.app/images/head/realstudent512.png"
        />
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
      </body>
    </html>
  );
}
