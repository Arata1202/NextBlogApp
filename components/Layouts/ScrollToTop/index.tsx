'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid';
import styles from './index.module.css';

export default function ScrollTopButton() {
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`${styles.button} fixed z-50 flex items-center justify-center shadow hover:text-blue-500 border ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <ChevronDoubleUpIcon className={styles.icon} />
      </button>
    </>
  );
}
