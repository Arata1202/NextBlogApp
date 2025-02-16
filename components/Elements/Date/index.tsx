'use client';

import { useTheme } from 'next-themes';
import { ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/libs/utils';
import styles from './index.module.css';

type Props = {
  date: string;
  updatedAt?: boolean;
};

export default function PublishedDate({ date, updatedAt = false }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <span className={`${styles.date} ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
        {updatedAt ? <ArrowPathIcon className="h-5 w-5" /> : <ClockIcon className="h-5 w-5" />}
        {formatDate(date)}
      </span>
    </>
  );
}
