import { getTagList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import styles from './layout.module.css';
import ScrollTopButton from '@/components/Common/ScrollToTop/page';

export const metadata = {
  // 検証 OK
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'リアル大学生',
  description: '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。',
  openGraph: {
    title: 'リアル大学生',
    description: '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。',
    images: '/images/thumbnail/7.webp',
    url: 'https://realunivlog.com',
  },
  alternates: {
    canonical: 'https://realunivlog.com',
  },
  icons: {
    icon: '/favicon.ico',
  },
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
        {/* GoogleAnalytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-LSE2CK3HZM`} />
        {/* GoogleAdsense */}
        <meta name="google-adsense-account" content="ca-pub-1705865999592590" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-LSE2CK3HZM', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
        {/* 共通 OK */}
        <meta name="format-detection" content="email=no,telephone=no,address=no" />
        {/* 共通 PWA OK */}
        <link rel="manifest" href="/manifest.json" />
        {/* 共通 ファビコン OK */}
        <link
          rel="icon"
          href="https://realunivlog.com/images/head/16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="https://realunivlog.com/images/head/32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="https://realunivlog.com/images/head/48.png"
          sizes="48x48"
          type="image/png"
        />
        {/* 共通 Appleアイコン OK */}
        <link rel="apple-touch-icon" href="https://realunivlog.com/images/head/realstudent.png" />
        {/* 共通 Windows用アイコン OK */}
        <meta
          name="msapplication-TileImage"
          content="https://realunivlog.com/images/head/realstudent512.png"
        />
        <meta name="msapplication-TileColor" content="#E0CBBA" />
        {/* 共通 Twitter用 OK */}
        <meta property="og:type" content="blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@Aokumoblog" />
        <meta name="twitter:site" content="@Aokumoblog" />
        <meta property="og:site_name" content="リアル大学生" />
        <meta property="og:locale" content="ja_JP" />

        {/* Search Console */}
        <meta name="google-site-verification" content={process.env.SEARCH_CONSOLE_ID} />
      </head>
      <body>
        <Header />
        {/* <Nav tags={tags.contents} /> */}
        <main className={styles.main}>{children}</main>
        <Footer />
        <ScrollTopButton />
      </body>
    </html>
  );
}
