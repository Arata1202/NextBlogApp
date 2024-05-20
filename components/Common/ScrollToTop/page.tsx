'use client';

import React from 'react';
import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid';

const ScrollTopButton: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed z-50 inline-flex items-center bg-white justify-center w-5 h-5 text-white shadow hover:bg-gray-300 hover:bg-opacity-40 transition-opacity duration-300 border border-gray-300"
      aria-label="Scroll to top"
      style={{
        transition: 'opacity 0.3s, visibility 0.3s',
        width: '40px',
        height: '40px',
        bottom: '10px',
        right: '10px',
      }}
    >
      <ChevronDoubleUpIcon
        className="h-4 w-4 text-black"
        aria-hidden="true"
        style={{ height: '25px', width: '25px' }}
      />
    </button>
  );
};

export default ScrollTopButton;
