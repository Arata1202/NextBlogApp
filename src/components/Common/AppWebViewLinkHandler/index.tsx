'use client';

import {
  createContext,
  useContext,
  useEffect,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import NextLink from 'next/link';
import {
  APP_WEBVIEW_QUERY_PARAMETER,
  APP_WEBVIEW_QUERY_VALUE,
  useAppWebViewMode,
} from '@/hooks/useAppWebViewMode';

const isModifiedClick = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

const NAVIGABLE_PROTOCOLS = new Set(['http:', 'https:']);

const shouldForceCurrentFrame = (target: string) =>
  Boolean(target && target.toLowerCase() !== '_self');

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

const AppWebViewContext = createContext(false);

export function SiteLink({
  href,
  children,
  ...props
}: ComponentPropsWithoutRef<'a'> & { href: string }) {
  const webView = useContext(AppWebViewContext);
  return webView ? (
    <a {...props} href={href}>
      {children}
    </a>
  ) : (
    <NextLink {...props} href={href}>
      {children}
    </NextLink>
  );
}

export default function AppWebViewLinkHandler({ children }: { children?: ReactNode }) {
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

      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download')) {
        return;
      }

      const navigationUrl = resolveAppWebViewNavigationUrl(
        anchor.href,
        window.location.origin,
        anchor.target || document.querySelector('base[target]')?.getAttribute('target') || '',
      );

      if (!navigationUrl) {
        return;
      }

      anchor.href = navigationUrl;
      anchor.target = '_self';
    };

    document.addEventListener('click', handleClick, true);

    return () => document.removeEventListener('click', handleClick, true);
  }, [isAppWebViewMode]);

  return (
    <AppWebViewContext.Provider value={isAppWebViewMode}>{children}</AppWebViewContext.Provider>
  );
}
