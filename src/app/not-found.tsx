import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className="text-center">
        <div className={styles.title}>404</div>
        <div className={styles.text}>ページが見つかりませんでした</div>
        <Link href="/" className="mt-4 inline-block underline underline-offset-4">
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
