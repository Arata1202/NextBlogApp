import { Metadata } from 'next';
import type { Viewport } from 'next';
import '../styles/globals.css';
import styles from './layout.module.css';
import { DESCRIPTION } from '@/constants/data';
import ThemeProvider from '@/contexts/ThemeProvider';
import ThemeWrapper from '@/contexts/ThemeWrapper';
import GoogleSearchConsole from '@/components/ThirdParties/GoogleSearchConsole';
import GoogleAdSense from '@/components/ThirdParties/GoogleAdSense';
import GoogleAnalytics from '@/components/ThirdParties/GoogleAnalytics';
import Instagram from '@/components/ThirdParties/Instagram';
import OneSignal from '@/components/ThirdParties/OneSignal';
import Embedly from '@/components/ThirdParties/Embedly';
import Header from '@/components/Common/Layouts/Header';
import Footer from '@/components/Common/Layouts/Footer';
import ScrollTopButton from '@/components/Common/Layouts/ScrollToTop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(): Promise<Metadata> {
  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `${defaultTitle}`;
  const description = DESCRIPTION;
  const images = `${defaultUrl}/images/thumbnail/7.webp`;
  const url = `${defaultUrl}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: images,
      url: url,
    },
    alternates: {
      canonical: url,
    },
  };
}

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `${defaultTitle}`;
  const url = `${defaultUrl}`;

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="email=no,telephone=no,address=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href={`${url}/images/head/16.png`} sizes="16x16" type="image/png" />
        <link rel="icon" href={`${url}/images/head/32.png`} sizes="32x32" type="image/png" />
        <link rel="icon" href={`${url}/images/head/48.png`} sizes="48x48" type="image/png" />
        <link rel="apple-touch-icon" href={`${url}/images/head/realstudent.png`} />
        <meta name="msapplication-TileImage" content={`${url}/images/head/realstudent512.png`} />
        <meta name="msapplication-TileColor" content="#E0CBBA" />
        <meta property="og:type" content="blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@Aokumoblog" />
        <meta name="twitter:site" content="@Aokumoblog" />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content="ja_JP" />
        <link rel="alternate" type="application/rss+xml" title={title} href={`${url}/rss.xml`} />
        <GoogleSearchConsole />
      </head>
      <body>
        <ThemeProvider defaultTheme="light">
          <ThemeWrapper />
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
          <ScrollTopButton />
          <GoogleAdSense />
          <GoogleAnalytics />
          <Instagram />
          <OneSignal />
          <Embedly />
        </ThemeProvider>
      </body>
    </html>
  );
}
