'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useGuardObserver } from '@/hooks/MutationObserver';
import styles from './index.module.css';

const publisherId = process.env.GOOGLE_ADSENSE_PUBLISHER_ID;

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

type Props = {
  slot: string;
  format?: string;
  responsive?: string;
  style?: any;
};

const AdUnit = ({ slot, format = 'rectangle', responsive = 'false', style }: Props) => {
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
    <div
      key={pathname.replace(/\//g, '-') + '-' + slot}
      className={`${styles.container} mut-guard`}
      style={{ ...style }}
    >
      <p className={`text-center ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
        スポンサーリンク
      </p>
      <ins
        className="adsbygoogle mut-guard"
        style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        data-ad-client={`ca-pub-${publisherId}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdUnit;
