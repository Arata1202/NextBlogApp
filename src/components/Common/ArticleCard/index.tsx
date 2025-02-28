'use client';

import { useTheme } from 'next-themes';
import { Article } from '@/libs/Microcms';
import styles from './index.module.css';
import DoubleDate from '../DoubleDate';
import WebpImage from '../Elements/WebpImage';

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <li className={styles.list}>
        <a
          href={`/articles/${article.id}`}
          className={`${styles.link} p-2 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
        >
          <WebpImage article={article} card={true} />
          <div className={styles.content}>
            <div className={styles.title}>{article.title}</div>
            <div className={styles.description}>{article.description}</div>
            <DoubleDate article={article} />
          </div>
        </a>
      </li>
    </>
  );
}
