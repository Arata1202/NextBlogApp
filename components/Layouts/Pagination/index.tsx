'use client';
import { useTheme } from 'next-themes';
import React, { useMemo } from 'react';
import styles from './index.module.css';
import { LIMIT } from '@/constants';

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  q?: string;
};

const Pagination: React.FC<Props> = React.memo(({ totalCount, current = 1, basePath = '', q }) => {
  const pages = useMemo(() => {
    return Array.from({ length: Math.ceil(totalCount / LIMIT) }, (_, i) => i + 1);
  }, [totalCount]);

  const getPageLink = (page: number) => {
    return `${basePath}/p/${page}${q ? `?q=${q}` : ''}`;
  };

  const { theme } = useTheme();

  return (
    <ul className={`${styles.container} PaginationContainer`}>
      {pages.map((p) => (
        <li className={styles.list} key={p}>
          {current !== p ? (
            <a href={getPageLink(p)}>
              <p
                className={`hover:text-blue-500 ${styles.item} ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                {p}
              </p>
            </a>
          ) : (
            <span
              className={`hover:text-blue-500 ${styles.item} ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              aria-current="page"
            >
              {p}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
