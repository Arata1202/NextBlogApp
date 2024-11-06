'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function ThemeWrapper() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.toggle('DarkTheme', theme === 'dark');
  }, [theme]);

  return null;
}
