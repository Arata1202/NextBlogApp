import Link from 'next/link';
import { useMemo } from 'react';
import React from 'react';
import styles from './index.module.css';
import { LIMIT } from '@/constants';

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  q?: string;
};

const Pagination = React.memo(({ totalCount, current = 1, basePath = '', q }: Props) => {
  const pages = useMemo(
    () => Array.from({ length: Math.ceil(totalCount / LIMIT) }, (_, i) => i + 1),
    [totalCount],
  );

  const buildPageUrl = (page: number) => {
    return `${basePath}/p/${page}${q ? `?q=${q}` : ''}`;
  };

  return (
    <ul className={styles.container}>
      {pages.map((p) => (
        <li className={styles.list} key={p}>
          {current !== p ? (
            <Link href={buildPageUrl(p)}>
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

export default Pagination;
