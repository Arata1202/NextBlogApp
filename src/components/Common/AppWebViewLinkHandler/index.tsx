'use client';

import { useEffect } from 'react';
import {
  APP_WEBVIEW_QUERY_PARAMETER,
  APP_WEBVIEW_QUERY_VALUE,
  useAppWebViewMode,
} from '@/hooks/useAppWebViewMode';

const isModifiedClick = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

export default function AppWebViewLinkHandler() {
  const isAppWebViewMode = useAppWebViewMode();

  useEffect(() => {
    if (!isAppWebViewMode) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>('a[href]');

      if (!anchor || anchor.hasAttribute('download')) {
        return;
      }

      if (anchor.target && anchor.target !== '_self') {
        return;
      }

      const url = new URL(anchor.href);

      if (url.origin !== window.location.origin) {
        return;
      }

      if (url.searchParams.get(APP_WEBVIEW_QUERY_PARAMETER) === APP_WEBVIEW_QUERY_VALUE) {
        return;
      }

      url.searchParams.set(APP_WEBVIEW_QUERY_PARAMETER, APP_WEBVIEW_QUERY_VALUE);
      event.preventDefault();
      window.location.assign(url.toString());
    };

    document.addEventListener('click', handleClick, true);

    return () => document.removeEventListener('click', handleClick, true);
  }, [isAppWebViewMode]);

  return null;
}
