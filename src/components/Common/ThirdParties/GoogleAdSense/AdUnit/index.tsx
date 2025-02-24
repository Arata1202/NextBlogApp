'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useGuardObserver } from '@/hooks/MutationObserver';

const publisherId = process.env.GOOGLE_ADSENSE_PUBLISHER_ID;

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

type DisplayProps = {
  slot: string;
  format?: string;
  responsive?: string;
  style?: any;
};

export default function AdUnit({
  slot,
  format = 'rectangle',
  responsive = 'false',
  style,
}: DisplayProps) {
  let pathname = usePathname();
  pathname = pathname ? pathname : '';
  useGuardObserver();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, [pathname]);

  const { theme } = useTheme();

  return (
    <div
      style={{ maxWidth: '100%' }}
      className="FirstAd mut-guard"
      key={pathname.replace(/\//g, '-') + '-' + slot}
    >
      <p className={`text-center ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
        スポンサーリンク
      </p>
      <ins
        className="adsbygoogle mut-guard"
        style={{ display: 'flex', justifyContent: 'center', width: '100%', ...style }}
        data-ad-client={`ca-pub-${publisherId}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
