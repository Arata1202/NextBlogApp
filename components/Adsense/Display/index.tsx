'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useGuardObserver } from '@/hooks/MutationObserver';
import styles from './index.module.css';

const PUBLISHER_ID = '1705865999592590';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

type DisplayProps = {
  slot: string;
};

export default function Display({ slot }: DisplayProps) {
  const { theme } = useTheme();

  useGuardObserver();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, [slot]);

  return (
    <div className={`${styles.unit} mut-guard`} key={slot}>
      <p className={`text-center ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
        スポンサーリンク
      </p>
      <ins
        className={`${styles.ins} mut-guard`}
        data-ad-client={`ca-pub-${PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format="rectangle"
        data-full-width-responsive="false"
      />
    </div>
  );
}
