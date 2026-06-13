'use client';

import { useTheme } from 'next-themes';
import { ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/formatDate';
import styles from './index.module.css';
import { getThemeClassName } from '@/styles/designTokens';

type Props = {
  date: string;
  updatedAt?: boolean;
};

export default function SingleDate({ date, updatedAt = false }: Props) {
  const { theme } = useTheme();
  const themeClassName = getThemeClassName(theme);

  return (
    <>
      <span className={`${styles.date} ${updatedAt && styles.updatedAt} ${themeClassName}`}>
        {updatedAt ? (
          <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ClockIcon className="h-5 w-5" aria-hidden="true" />
        )}
        {formatDate(date)}
      </span>
    </>
  );
}
