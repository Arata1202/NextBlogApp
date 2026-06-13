'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { compactIconControlClassName } from '@/components/Common/controlClassNames';
import { colorClassNames } from '@/styles/designTokens';

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  if (resolvedTheme === 'dark') {
    return (
      <button
        type="button"
        aria-label="ライトテーマに切り替え"
        className={`${compactIconControlClassName} ${colorClassNames.accentHoverText} cursor-pointer`}
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
        className={`${compactIconControlClassName} ${colorClassNames.accentHoverText} cursor-pointer`}
        onClick={() => {
          setTheme('dark');
        }}
      >
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }
}
