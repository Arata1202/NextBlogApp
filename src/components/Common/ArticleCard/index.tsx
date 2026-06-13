'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Article } from '@/types/microcms';
import styles from './index.module.css';
import DoubleDate from '../DoubleDate';
import WebpImage from '../Elements/WebpImage';
import { getThemeClassName, surfaceClassNames } from '@/styles/designTokens';

type Props = {
  article: Article;
  priority?: boolean;
};

export default function ArticleCard({ article, priority = false }: Props) {
  const { theme } = useTheme();
  const themeClassName = getThemeClassName(theme);

  return (
    <>
      <li className={styles.list}>
        <Link
          href={`/articles/${article.id}`}
          className={`${styles.link} p-2 ${surfaceClassNames.card} ${themeClassName}`}
        >
          <WebpImage article={article} card={true} priority={priority} />
          <div className={styles.content}>
            <div className={styles.title}>{article.title}</div>
            <div className={styles.description}>{article.description}</div>
            <DoubleDate article={article} />
          </div>
        </Link>
      </li>
    </>
  );
}
