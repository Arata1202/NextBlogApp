'use client';

import { useHydratedTheme } from '@/hooks/useHydratedTheme';
import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid';
import styles from './index.module.css';
import { iconControlClassName } from '@/components/Common/controlClassNames';

export default function ScrollTopButton() {
  const { theme } = useHydratedTheme();

  const scrollToTop = () => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label="ページ上部へ戻る"
        onClick={scrollToTop}
        className={`${iconControlClassName} ${styles.button} fixed z-50 flex items-center justify-center shadow hover:text-blue-600 border ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <ChevronDoubleUpIcon className={styles.icon} aria-hidden="true" />
      </button>
    </>
  );
}
