'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  if (resolvedTheme === 'dark') {
    return <SunIcon className="h-5 w-5" onClick={() => setTheme('light')} />;
  }

  if (resolvedTheme === 'light') {
    return <MoonIcon className="h-5 w-5" onClick={() => setTheme('dark')} />;
  }
}
