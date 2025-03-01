'use client';

import { useTheme } from 'next-themes';
import { ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useFormatDate } from '@/utils/formatDate';
import styles from './index.module.css';

type Props = {
  date: string;
  updatedAt?: boolean;
};

export default function SingleDate({ date, updatedAt = false }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <span
        className={`${styles.date} ${updatedAt && styles.updatedAt} ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        {updatedAt ? <ArrowPathIcon className="h-5 w-5" /> : <ClockIcon className="h-5 w-5" />}
        {useFormatDate(date)}
      </span>
    </>
  );
}
