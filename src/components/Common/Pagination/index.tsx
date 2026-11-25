'use client';

import { SiteLink as Link } from '@/components/Common/AppWebViewLinkHandler';
import { useResolvedTheme } from '@/components/Common/useResolvedTheme';
import { APP_WEBVIEW_QUERY_PARAMETER, APP_WEBVIEW_QUERY_VALUE } from '@/hooks/useAppWebViewMode';
import { LIMIT } from '@/constants/limit';
import styles from './index.module.css';
import {
  colorClassNames,
  getThemeClassName,
  getThemeVariantClassName,
  themeVariantClassNames,
} from '@/styles/uiClassNames';

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  hideWhenStacked?: boolean;
  q?: string;
  useQueryPage?: boolean;
  appWebView?: boolean;
};

type PageItem = number | 'ellipsis-left' | 'ellipsis-right';

function getPageItems(totalPages: number, current: number): PageItem[] {
  if (totalPages <= 0) {
    return [];
  }

  const start = Math.max(1, current - 2);
  const end = Math.min(totalPages, current + 2);
  const pages: PageItem[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('ellipsis-left');
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('ellipsis-right');
    pages.push(totalPages);
  }

  return pages;
}

export default function Pagination({
  totalCount,
  current: requestedPage = 1,
  basePath = '',
  hideWhenStacked = false,
  q,
  useQueryPage = false,
  appWebView = false,
}: Props) {
  const theme = useResolvedTheme();
  const themeClassName = getThemeClassName(theme);
  const selectedSurfaceClassName = getThemeVariantClassName(
    theme,
    themeVariantClassNames.selectedSurface,
  );

  const totalPages = Math.ceil(totalCount / LIMIT);
  const current = Number.isInteger(requestedPage)
    ? Math.min(totalPages, Math.max(1, requestedPage))
    : 1;
  const pages = getPageItems(totalPages, current);
  const getHref = (page: number) => {
    if (!useQueryPage) {
      return `${basePath}/p/${page}` + (q ? `?q=${encodeURIComponent(q)}` : '');
    }

    const params = new URLSearchParams();
    if (q) {
      params.set('q', q);
    }
    params.set('page', String(page));
    if (appWebView) params.set(APP_WEBVIEW_QUERY_PARAMETER, APP_WEBVIEW_QUERY_VALUE);

    return `${basePath}?${params.toString()}`;
  };
  const navClassName = hideWhenStacked ? styles.hideWhenStacked : undefined;

  return (
    <nav className={navClassName} aria-label="ページネーション">
      <ul className={styles.container}>
        {pages.map((p) => (
          <li className={styles.list} key={p}>
            {typeof p === 'number' ? (
              current !== p ? (
                <Link
                  href={getHref(p)}
                  className={`${styles.item} ${colorClassNames.accentHoverText} ${themeClassName}`}
                  aria-label={`${p}ページ目へ移動`}
                >
                  {p}
                </Link>
              ) : (
                <span
                  className={`${styles.item} ${selectedSurfaceClassName}`}
                  aria-current="page"
                  aria-label={`${p}ページ目`}
                >
                  {p}
                </span>
              )
            ) : (
              <span className={`${styles.item} ${styles.ellipsis}`} aria-hidden="true">
                ...
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
