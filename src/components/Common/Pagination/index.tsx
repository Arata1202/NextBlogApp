'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { LIMIT } from '@/constants/limit';
import styles from './index.module.css';

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  hideWhenStacked?: boolean;
  q?: string;
  useQueryPage?: boolean;
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
    pages.push(1, 'ellipsis-left');
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages) {
    pages.push('ellipsis-right', totalPages);
  }

  return pages;
}

export default function Pagination({
  totalCount,
  current = 1,
  basePath = '',
  hideWhenStacked = false,
  q,
  useQueryPage = false,
}: Props) {
  const { theme } = useTheme();

  const totalPages = Math.ceil(totalCount / LIMIT);
  const pages = getPageItems(totalPages, current);
  const getHref = (page: number) => {
    if (!useQueryPage) {
      return `${basePath}/p/${page}` + (q ? `?q=${q}` : '');
    }

    const params = new URLSearchParams();
    if (q) {
      params.set('q', q);
    }
    params.set('page', String(page));

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
                  className={`${styles.item} hover:text-blue-600 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  aria-label={`${p}ページ目へ移動`}
                >
                  {p}
                </Link>
              ) : (
                <span
                  className={`${styles.item} ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
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
