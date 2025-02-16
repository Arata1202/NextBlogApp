'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  article: Article;
};

export default function SidebarArticleListItem({ article }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <ul
        className={`border mt-5 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <li>
          <a href={`/articles/${article.id}`} className={styles.link}>
            <img src={article.thumbnail.url} alt="サムネイル" className={styles.image} />
            <div className={`${styles.title} font-bold`}>{article.title}</div>
          </a>
        </li>
      </ul>
    </>
  );
}
