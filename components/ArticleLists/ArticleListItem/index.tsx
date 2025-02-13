'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import PublishedDate from '../../Elements/Date';

type Props = {
  article: Article;
};

export default function ArticleListItem({ article }: Props) {
  const { theme } = useTheme();

  const isNextDayOrLater = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1 > d2;
  };

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
            <div className={styles.date}>
              <PublishedDate date={article.publishedAt!} updatedAt={false} />
              {article.updatedAt && isNextDayOrLater(article.updatedAt, article.publishedAt!) && (
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <PublishedDate date={article.updatedAt!} updatedAt={true} />
                </>
              )}
            </div>
          </div>
        </a>
      </li>
    </>
  );
}
