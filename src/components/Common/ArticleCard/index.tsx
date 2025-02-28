'use client';

import { useTheme } from 'next-themes';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import DoubleDate from '../DoubleDate';

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
          <picture>
            <source
              type="image/webp"
              media="(max-width: 640px)"
              srcSet={`${article.thumbnail.url}?fm=webp&w=414 1x, ${article.thumbnail.url}?fm=webp&w=414&dpr=2 2x`}
            />
            <source
              type="image/webp"
              srcSet={`${article.thumbnail.url}?fm=webp&fit=crop&w=240&h=126 1x, ${article.thumbnail.url}?fm=webp&fit=crop&w=240&h=126&dpr=2 2x`}
            />
            <img
              src={article.thumbnail.url}
              alt="サムネイル"
              className={styles.image}
              width={article.thumbnail.width}
              height={article.thumbnail.height}
            />
          </picture>
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
