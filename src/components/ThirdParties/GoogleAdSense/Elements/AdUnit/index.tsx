'use client';

import { useEffect, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { useResolvedTheme } from '@/components/Common/useResolvedTheme';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import { useAppWebViewMode } from '@/hooks/useAppWebViewMode';
import styles from './index.module.css';
import { getGoogleAdSensePublisherId } from '@/config/publicEnv';
import { getThemeClassName } from '@/styles/uiClassNames';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

type Props = {
  slot: string;
  format?: string;
  responsive?: string;
  sidebarStickyStop?: boolean;
  style?: CSSProperties;
};

export default function AdUnit({
  slot,
  format = 'rectangle',
  responsive = 'false',
  sidebarStickyStop = false,
  style,
}: Props) {
  let pathname = usePathname();
  pathname = pathname ? pathname : '';

  const theme = useResolvedTheme();
  const isAppWebViewMode = useAppWebViewMode();
  const themeClassName = getThemeClassName(theme);
  const publisherId = getGoogleAdSensePublisherId();

  const guardRef = useMutationObserver();

  useEffect(() => {
    if (isAppWebViewMode || !publisherId) {
      return;
    }

    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAppWebViewMode, pathname, publisherId, slot]);

  if (isAppWebViewMode || !publisherId) {
    return null;
  }

  return (
    <>
      <div
        ref={guardRef}
        key={JSON.stringify([pathname, slot])}
        className={`${styles.container} mut-guard`}
        data-web-ad
        data-sidebar-sticky-stop={sidebarStickyStop ? '' : undefined}
        style={{ ...style }}
      >
        <p className={`text-center ${themeClassName}`}>スポンサーリンク</p>
        <ins
          className={`${styles.adUnit} adsbygoogle mut-guard`}
          data-ad-client={`ca-pub-${publisherId}`}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </>
  );
}
