import Header from '@/components/Common/Layouts/Header';
import Footer from '@/components/Common/Layouts/Footer';
import './globals.css';
import styles from './layout.module.css';
import Script from 'next/script';
import { Adsense } from '@/components/Common/Adsense/AdsenseScript';
import { ThemeProvider } from '@/libs/theme-provider';
import ThemeWrapper from '@/libs/theme-wrapper';
import ScrollTopButton from '@/components/Common/Layouts/ScrollToTop';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
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
  const onesignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  return (
    <html lang="ja" suppressHydrationWarning>
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
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "${onesignalAppId}",
            });
          });
        `}
        </Script>
        <meta name="format-detection" content="email=no,telephone=no,address=no" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
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
        {/* <meta name="apple-itunes-app" content="app-id=6590619103" /> */}
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
        <ThemeProvider defaultTheme="light">
          <ThemeWrapper />
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
          <ScrollTopButton />
          <Adsense />
          <Script async strategy="afterInteractive" src="//www.instagram.com/embed.js" />
        </ThemeProvider>
      </body>
    </html>
  );
}
