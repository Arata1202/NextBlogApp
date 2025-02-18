'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PUBLISHER_ID = '1705865999592590';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

type InFeedProps = {
  slot: string;
  format?: string;
  responsive?: string;
  style?: any;
};

const InFeed = ({ slot, format = 'fluid', responsive = 'true', style }: InFeedProps) => {
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
    <div key={pathname.replace(/\//g, '-') + '-' + slot}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', ...style }}
        data-ad-client={`ca-pub-${PUBLISHER_ID}`}
        data-ad-layout-key="-5k+co+1n-b5+e3"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default InFeed;
