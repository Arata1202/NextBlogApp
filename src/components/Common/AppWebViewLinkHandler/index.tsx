'use client';

import { useEffect } from 'react';
import {
  APP_WEBVIEW_QUERY_PARAMETER,
  APP_WEBVIEW_QUERY_VALUE,
  useAppWebViewMode,
} from '@/hooks/useAppWebViewMode';

const isModifiedClick = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

const NAVIGABLE_PROTOCOLS = new Set(['http:', 'https:']);

const shouldForceCurrentFrame = (target: string) => Boolean(target && target !== '_self');

export const resolveAppWebViewNavigationUrl = (
  href: string,
  currentOrigin: string,
  target = '',
) => {
  let url: URL;

  try {
    url = new URL(href, currentOrigin);
  } catch {
    return null;
  }

  if (!NAVIGABLE_PROTOCOLS.has(url.protocol)) {
    return null;
  }

  const forceCurrentFrame = shouldForceCurrentFrame(target);

  if (url.origin !== currentOrigin) {
    return forceCurrentFrame ? url.toString() : null;
  }

  const hasAppWebViewParam =
    url.searchParams.get(APP_WEBVIEW_QUERY_PARAMETER) === APP_WEBVIEW_QUERY_VALUE;

  url.searchParams.set(APP_WEBVIEW_QUERY_PARAMETER, APP_WEBVIEW_QUERY_VALUE);

  if (hasAppWebViewParam && !forceCurrentFrame) {
    return null;
  }

  return url.toString();
};

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

      const navigationUrl = resolveAppWebViewNavigationUrl(
        anchor.href,
        window.location.origin,
        anchor.target,
      );

      if (!navigationUrl) {
        return;
      }

      event.preventDefault();
      window.location.assign(navigationUrl);
    };

    document.addEventListener('click', handleClick, true);

    return () => document.removeEventListener('click', handleClick, true);
  }, [isAppWebViewMode]);

  return null;
}
