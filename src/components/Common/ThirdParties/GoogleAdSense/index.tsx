import Script from 'next/script';

export const GoogleAdSense = () => {
  const publisherId = process.env.GOOGLE_ADSENSE_PUBLISHER_ID;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
