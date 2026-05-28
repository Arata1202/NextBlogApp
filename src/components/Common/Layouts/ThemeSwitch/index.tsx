'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  if (resolvedTheme === 'dark') {
    return (
      <button
        type="button"
        aria-label="ライトテーマに切り替え"
        className="inline-flex h-5 w-5 items-center justify-center hover:text-blue-500 cursor-pointer"
        onClick={() => {
          setTheme('light');
        }}
      >
        <SunIcon className="h-5 w-5" />
      </button>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <button
        type="button"
        aria-label="ダークテーマに切り替え"
        className="inline-flex h-5 w-5 items-center justify-center hover:text-blue-500 cursor-pointer"
        onClick={() => {
          setTheme('dark');
        }}
      >
        <MoonIcon className="h-5 w-5" />
      </button>
    );
  }
}
