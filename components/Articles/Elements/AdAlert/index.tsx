'use client';

import { useTheme } from 'next-themes';
import { BellIcon } from '@heroicons/react/24/outline';
import styles from './index.module.css';

export default function AdAlert() {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`${styles.alert} flex justify-center text-center p-3 border ${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
      >
        <BellIcon className="h-7 w-7 mr-2" />
        記事内に広告が含まれています。
      </div>
    </>
  );
}
