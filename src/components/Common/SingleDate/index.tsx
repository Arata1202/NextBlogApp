'use client';

import { useHydratedTheme } from '@/hooks/useHydratedTheme';
import { ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/formatDate';
import styles from './index.module.css';

type Props = {
  date: string;
  updatedAt?: boolean;
};

export default function SingleDate({ date, updatedAt = false }: Props) {
  const { theme } = useHydratedTheme();

  return (
    <>
      <span
        className={`${styles.date} ${updatedAt && styles.updatedAt} ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
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
