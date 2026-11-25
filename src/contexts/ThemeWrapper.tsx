'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function ThemeWrapper() {
  const { resolvedTheme, theme } = useTheme();

  useEffect(() => {
    document.body.classList.toggle('DarkTheme', (resolvedTheme ?? theme) === 'dark');
    return () => document.body.classList.remove('DarkTheme');
  }, [resolvedTheme, theme]);

  return null;
}
