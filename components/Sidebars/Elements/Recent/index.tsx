import React from 'react';
import SidebarArticleListItem from '../Elements/SidebarArticleListItem';
import { Article } from '@/libs/microcms';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';

type Props = {
  articles?: Article[];
};

export default function Recent({ articles }: Props) {
  const sortedArticles = articles
    ?.slice()
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
      <h1 className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}>
        <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        最新の投稿
      </h1>
      {sortedArticles && sortedArticles.length > 0 ? (
        <div>
          {sortedArticles.map((article) => (
            <SidebarArticleListItem key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center">新着記事はありません</p>
      )}
    </div>
  );
}
