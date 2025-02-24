import Script from 'next/script';

export default function GoogleAdSense() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.GOOGLE_ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
