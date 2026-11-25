'use client';

import { useTheme } from 'next-themes';
import { useHasMounted } from '@/hooks/useHasMounted';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { compactIconControlClassName } from '@/components/Common/controlClassNames';
import { colorClassNames } from '@/styles/uiClassNames';

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  const mounted = useHasMounted();
  if (!mounted || !resolvedTheme) {
    return <span className={compactIconControlClassName} aria-hidden="true" />;
  }
  const dark = resolvedTheme === 'dark';
  const Icon = dark ? SunIcon : MoonIcon;
  return (
    <button
      type="button"
      aria-label={dark ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'}
      className={`${compactIconControlClassName} ${colorClassNames.accentHoverText} cursor-pointer`}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
