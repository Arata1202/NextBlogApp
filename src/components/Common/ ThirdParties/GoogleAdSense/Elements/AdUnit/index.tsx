'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useGuardObserver } from '@/hooks/MutationObserver';
import styles from './index.module.css';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

type DisplayProps = {
  slot: string;
  format?: string;
  responsive?: string;
  style?: object;
};

export default function AdUnit({
  slot,
  format = 'rectangle',
  responsive = 'false',
  style,
}: DisplayProps) {
  let pathname = usePathname();
  pathname = pathname ? pathname : '';

  const { theme } = useTheme();

  useGuardObserver();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, [pathname]);

  return (
    <>
      <div
        className={`${styles.container} mut-guard`}
        style={{ ...style }}
        key={pathname.replace(/\//g, '-') + '-' + slot}
      >
        <p className={`text-center ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
          スポンサーリンク
        </p>
        <ins
          className="adsbygoogle mut-guard"
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          data-ad-client={`ca-pub-${process.env.GOOGLE_ADSENSE_PUBLISHER_ID}`}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </>
  );
}
