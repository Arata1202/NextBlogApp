'use client';

import { useTheme } from 'next-themes';
import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid';
import styles from './index.module.css';
import { interactiveFocusClassName } from '@/components/Common/controlClassNames';

export default function ScrollTopButton() {
  const { theme } = useTheme();

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
        className={`${interactiveFocusClassName} ${styles.button} fixed z-50 flex items-center justify-center shadow-sm hover:text-blue-600 border ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <ChevronDoubleUpIcon className={styles.icon} aria-hidden="true" />
      </button>
    </>
  );
}
