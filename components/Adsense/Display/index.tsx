'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useGuardObserver } from '@/hooks/MutationObserver';

const PUBLISHER_ID = '1705865999592590';

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

const Display = ({ slot, format = 'rectangle', responsive = 'false', style }: DisplayProps) => {
  let pathname = usePathname();
  pathname = pathname ? pathname : '';
  useGuardObserver();

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
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
        data-ad-client={`ca-pub-${PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default Display;
