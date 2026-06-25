'use client';

import { useEffect, useState } from 'react';

export const APP_WEBVIEW_QUERY_PARAMETER = 'app';
export const APP_WEBVIEW_QUERY_VALUE = '1';

const canUseDom = () => typeof window !== 'undefined' && typeof document !== 'undefined';

function hasAppWebViewParameter() {
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
    const url = new URL(href, window.location.origin);

    if (url.origin !== window.location.origin) {
      return href;
    }

    url.searchParams.set(APP_WEBVIEW_QUERY_PARAMETER, APP_WEBVIEW_QUERY_VALUE);

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

function readAppWebViewMode() {
  if (!canUseDom()) {
    return false;
  }

  try {
    if (hasAppWebViewParameter()) {
      document.documentElement.dataset.appWebview = APP_WEBVIEW_QUERY_VALUE;
      return true;
    }

    delete document.documentElement.dataset.appWebview;
    return false;
  } catch {
    return false;
  }
}

export function useAppWebViewMode() {
  const [isAppWebViewMode, setIsAppWebViewMode] = useState(hasAppWebViewParameter);

  useEffect(() => {
    const update = () => setIsAppWebViewMode(readAppWebViewMode());

    update();
    window.addEventListener('popstate', update);

    return () => window.removeEventListener('popstate', update);
  }, []);

  return isAppWebViewMode;
}
