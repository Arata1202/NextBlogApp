'use client';
import { useTheme } from 'next-themes';
import React, { memo } from 'react';
import Image from 'next/image';
import { Article } from '@/libs/microcms';

type Props = {
  article: Article;
};

const SidebarArticleListItem = ({ article }: Props) => {
  const imageSrc = article.thumbnail?.url || '/no-image.png';

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = `/articles/${article.id}`;
  };

  const { theme } = useTheme();

  return (
    <div>
      <ol
        className={`ArticleListItem_list border mt-5 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <li>
          <a href={`/articles/${article.id}`} className="sidebarPopularPost" onClick={handleClick}>
            <Image
              src={imageSrc}
              alt="サムネイル"
              width="600"
              height="300"
              placeholder="blur"
              blurDataURL={imageSrc}
            />
            <div>
              <div className="ArticleListItem_title font-bold">{article.title}</div>
            </div>
          </a>
        </li>
      </ol>
    </div>
  );
};

export default memo(SidebarArticleListItem);
