'use client';

import { useTheme } from 'next-themes';
import { getTextLinkClassName } from '@/components/Common/controlClassNames';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className={styles.container}>
      <div className="text-center">
        <div className={styles.title}>404</div>
        <div className={styles.text}>ページが見つかりませんでした</div>
        <Link href="/" className={`mt-4 inline-block ${getTextLinkClassName(theme)}`}>
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
