//最適化済み

import Link from 'next/link';
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

  return (
    <ul className={styles.container}>
      {pages.map((p) => (
        <li className={styles.list} key={p}>
          {current !== p ? (
            <Link href={getPageLink(p)}>
              <a className={styles.item}>{p}</a>
            </Link>
          ) : (
            <span className={`${styles.item} ${styles.current}`} aria-current="page">
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
