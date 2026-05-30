'use client';

import { useHydratedTheme } from '@/hooks/useHydratedTheme';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { iconControlClassName } from '@/components/Common/controlClassNames';

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useHydratedTheme();

  if (resolvedTheme === 'dark') {
    return (
      <button
        type="button"
        aria-label="ライトテーマに切り替え"
        className={`${iconControlClassName} inline-flex h-5 w-5 items-center justify-center hover:text-blue-600 cursor-pointer`}
        onClick={() => {
          setTheme('light');
        }}
      >
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <button
        type="button"
        aria-label="ダークテーマに切り替え"
        className={`${iconControlClassName} inline-flex h-5 w-5 items-center justify-center hover:text-blue-600 cursor-pointer`}
        onClick={() => {
          setTheme('dark');
        }}
      >
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }
}
