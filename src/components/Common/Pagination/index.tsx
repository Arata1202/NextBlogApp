'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { LIMIT } from '@/constants/limit';
import styles from './index.module.css';

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  q?: string;
};

export default function Pagination({ totalCount, current = 1, basePath = '', q }: Props) {
  const { theme } = useTheme();

  const pages = Array.from({ length: Math.ceil(totalCount / LIMIT) }).map((_, i) => i + 1);

  return (
    <>
      <ul className={styles.container}>
        {pages.map((p) => (
          <li className={styles.list} key={p}>
            {current !== p ? (
              <Link
                href={`${basePath}/p/${p}` + (q ? `?q=${q}` : '')}
                className={`${styles.item} hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                {p}
              </Link>
            ) : (
              <span
                className={`${styles.item} ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                {p}
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
