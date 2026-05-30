import Script from 'next/script';
import { getGoogleAdSensePublisherId } from '@/config/publicEnv';

export default function GoogleAdSense() {
  const publisherId = getGoogleAdSensePublisherId();

  if (!publisherId) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
