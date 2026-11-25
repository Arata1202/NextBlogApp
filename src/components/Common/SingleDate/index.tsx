'use client';

import { useResolvedTheme } from '@/components/Common/useResolvedTheme';
import { ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/formatDate';
import styles from './index.module.css';
import { getThemeClassName } from '@/styles/uiClassNames';

type Props = {
  date: string;
  updatedAt?: boolean;
};

export default function SingleDate({ date, updatedAt = false }: Props) {
  const theme = useResolvedTheme();
  const themeClassName = getThemeClassName(theme);

  if (!Number.isFinite(Date.parse(date))) return null;

  return (
    <>
      <span className={`${styles.date} ${updatedAt ? styles.updatedAt : ''} ${themeClassName}`}>
        {updatedAt ? (
          <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ClockIcon className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="sr-only">{updatedAt ? '更新日' : '公開日'}</span>
        <time dateTime={date}>{formatDate(date)}</time>
      </span>
    </>
  );
}
