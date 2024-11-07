'use client';
import { useTheme } from 'next-themes';
import { formatDate } from '@/libs/utils';
import styles from './index.module.css';
import { ClockIcon } from '@heroicons/react/24/outline';

type Props = {
  date: string;
};

export default function PublishedDate({ date }: Props) {
  const { theme } = useTheme();
  return (
    <span className={`${styles.date} ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
      <ClockIcon className="h-5 w-5" aria-hidden="true" />
      {formatDate(date)}
    </span>
  );
}
