'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function WebViewNavigation() {
  const params = useSearchParams();
  useEffect(() => {
    window.dispatchEvent(new Event('app-webview-navigation'));
  }, [params]);
  return null;
}
