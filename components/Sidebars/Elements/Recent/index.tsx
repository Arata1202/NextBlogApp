'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { Article } from '@/libs/microcms';
import SidebarArticleListItem from '../Elements/SidebarArticleListItem';

type Props = {
  articles: Article[];
};

export default function Recent({ articles }: Props) {
  const { theme } = useTheme();

  const sortedArticles = articles
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
          <SidebarArticleListItem key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}
