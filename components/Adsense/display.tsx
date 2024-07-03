'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

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

const Display = ({ slot, format = 'auto', responsive = 'true', style }: DisplayProps) => {
  let pathname = usePathname();
  pathname = pathname ? pathname : '';

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, [pathname]);

  return (
    <div
      style={{ maxWidth: '100%', overflow: 'hidden' }}
      key={pathname.replace(/\//g, '-') + '-' + slot}
    >
      <p className="text-center">スポンサーリンク</p>
      <ins
        className="adsbygoogle check"
        style={{ display: 'block', width: '100%', ...style }}
        data-ad-client={`ca-pub-${PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default Display;
