import React from 'react';
import Header from '@/components/Layouts/Header';
import Footer from '@/components/Layouts/Footer';
import './globals.css';
import styles from './layout.module.css';
import Script from 'next/script';
import { Adsense } from '@/components/Adsense/adsense';

export const metadata = {
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
  return (
    <html lang="ja">
      <head>
        <Script async strategy="lazyOnload" src={process.env.GOOGLE_ANALYTICS_ID} />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
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
        <meta name="format-detection" content="email=no,telephone=no,address=no" />
        <link rel="manifest" href="/manifest.json" />
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
        <link rel="apple-touch-icon" href="https://realunivlog.com/images/head/realstudent.png" />
        <meta name="apple-itunes-app" content="app-id=6590619103" />
        <meta
          name="msapplication-TileImage"
          content="https://realunivlog.com/images/head/realstudent512.png"
        />
        <meta name="msapplication-TileColor" content="#E0CBBA" />
        <meta property="og:type" content="blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@Aokumoblog" />
        <meta name="twitter:site" content="@Aokumoblog" />
        <meta property="og:site_name" content="リアル大学生" />
        <meta property="og:locale" content="ja_JP" />
        <meta name="google-site-verification" content={process.env.SEARCH_CONSOLE_ID} />
      </head>
      <body>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
        <Adsense />
        <Script async strategy="afterInteractive" src="//www.instagram.com/embed.js" />
      </body>
    </html>
  );
}
