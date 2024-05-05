import Link from 'next/link';
import { useMemo } from 'react';
import styles from './index.module.css';
import { LIMIT } from '@/constants';

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  q?: string;
};

export default function Pagination({ totalCount, current = 1, basePath = '', q }: Props) {
  const pages = useMemo(() => {
    return Array.from({ length: Math.ceil(totalCount / LIMIT) }, (_, i) => i + 1);
  }, [totalCount]);

  return (
    <ul className={styles.container}>
      {pages.map((p) => (
        <li className={styles.list} key={p}>
          {current !== p ? (
            <Link href={`${basePath}/p/${p}${q ? `?q=${q}` : ''}`}>
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
}
