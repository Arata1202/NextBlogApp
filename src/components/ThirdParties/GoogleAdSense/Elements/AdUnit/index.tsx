'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import { useAppWebViewMode } from '@/hooks/useAppWebViewMode';
import styles from './index.module.css';
import { getGoogleAdSensePublisherId } from '@/config/publicEnv';
import { getThemeClassName } from '@/styles/designTokens';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

type Props = {
  slot: string;
  format?: string;
  responsive?: string;
  style?: object;
};

export default function AdUnit({ slot, format = 'rectangle', responsive = 'false', style }: Props) {
  let pathname = usePathname();
  pathname = pathname ? pathname : '';

  const { theme } = useTheme();
  const isAppWebViewMode = useAppWebViewMode();
  const themeClassName = getThemeClassName(theme);
  const publisherId = getGoogleAdSensePublisherId();

  useMutationObserver();

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
  }, [isAppWebViewMode, pathname, publisherId]);

  if (isAppWebViewMode || !publisherId) {
    return null;
  }

  return (
    <>
      <div
        key={pathname.replace(/\//g, '-') + '-' + slot}
        className={`${styles.container} mut-guard`}
        data-web-ad
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
