'use client';

import { useEffect, useSyncExternalStore } from 'react';

export const APP_WEBVIEW_QUERY_PARAMETER = 'app';
export const APP_WEBVIEW_QUERY_VALUE = '1';

const canUseDom = () => typeof window !== 'undefined' && typeof document !== 'undefined';

export function hasAppWebViewParameter() {
  if (!canUseDom()) {
    return false;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(APP_WEBVIEW_QUERY_PARAMETER) === APP_WEBVIEW_QUERY_VALUE;
  } catch {
    return false;
  }
}

export function appendAppWebViewParam(href: string) {
  if (!canUseDom()) {
    return href;
  }

  try {
    const url = new URL(href, document.baseURI);

    if (url.origin !== window.location.origin) {
      return href;
    }

    url.searchParams.set(APP_WEBVIEW_QUERY_PARAMETER, APP_WEBVIEW_QUERY_VALUE);

    return url.pathname.startsWith('//') ? url.href : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

function subscribe(update: () => void) {
  window.addEventListener('popstate', update);
  window.addEventListener('app-webview-navigation', update);
  return () => {
    window.removeEventListener('popstate', update);
    window.removeEventListener('app-webview-navigation', update);
  };
}

export function useAppWebViewMode() {
  const enabled = useSyncExternalStore(subscribe, hasAppWebViewParameter, () => false);
  useEffect(() => {
    if (hasAppWebViewParameter())
      document.documentElement.dataset.appWebview = APP_WEBVIEW_QUERY_VALUE;
    else delete document.documentElement.dataset.appWebview;
  }, [enabled]);
  return enabled;
}
