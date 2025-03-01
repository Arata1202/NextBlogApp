'use client';

import { useTheme } from 'next-themes';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  recentArticles: Article[];
};

export default function Recent({ recentArticles }: Props) {
  const { theme } = useTheme();

  const sortedArticles = recentArticles
    ?.slice()
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <>
      <div
        className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <BellAlertIcon className="h-8 w-8 mr-2" />
          最新の投稿
        </div>
        {sortedArticles.map((article) => (
          <ul
            key={article.id}
            className={`border mt-5 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            <li>
              <a href={`/articles/${article.id}`} className={styles.link}>
                <img src={article.thumbnail.url} alt="サムネイル" className={styles.image} />
                <div className={`${styles.title} font-bold`}>{article.title}</div>
              </a>
            </li>
          </ul>
        ))}
      </div>
    </>
  );
}
