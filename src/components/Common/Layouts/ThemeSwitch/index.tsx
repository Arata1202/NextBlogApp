'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  if (resolvedTheme === 'dark') {
    return (
      <SunIcon
        className="h-5 w-5 hover:text-blue-500 cursor-pointer"
        onClick={() => {
          setTheme('light');
          window.location.reload();
        }}
      />
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <MoonIcon
        className="h-5 w-5 hover:text-blue-500 cursor-pointer"
        onClick={() => {
          setTheme('dark');
          window.location.reload();
        }}
      />
    );
  }
}
