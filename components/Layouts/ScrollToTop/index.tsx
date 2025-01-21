'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid';

const ScrollTopButton: React.FC = () => {
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed z-50 flex items-center justify-center shadow hover:text-blue-500 border ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      aria-label="Scroll to top"
      style={{
        transition: 'opacity 0.3s, visibility 0.3s',
        width: '40px',
        height: '40px',
        bottom: `calc(10px + env(safe-area-inset-bottom))`,
        right: '10px',
      }}
    >
      <ChevronDoubleUpIcon aria-hidden="true" style={{ height: '25px', width: '25px' }} />
    </button>
  );
};

export default ScrollTopButton;
