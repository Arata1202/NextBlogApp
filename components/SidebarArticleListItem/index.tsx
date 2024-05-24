'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Article } from '@/libs/microcms';

type Props = {
  article: Article;
};

function getImageSrcSizes(imageSrc: string) {
  return {
    mobileSrcSet: `${imageSrc}?fm=webp&w=414 1x, ${imageSrc}?fm=webp&w=414&dpr=2 2x`,
    desktopSrcSet: `${imageSrc}?fm=webp&fit=crop&w=240&h=126 1x, ${imageSrc}?fm=webp&fit=crop&w=240&h=126&dpr=2 2x`,
  };
}

const SidebarArticleListItem = ({ article }: Props) => {
  const imageSrc = article.thumbnail?.url || '/no-image.png';
  const isThumbnailAvailable = !!article.thumbnail;
  const { mobileSrcSet, desktopSrcSet } = getImageSrcSizes(imageSrc);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = `/articles/${article.id}`;
  };

  return (
    <div>
      <ol
        className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
        onClick={handleClick}
      >
        <li>
          <div>
            <Image
              src={imageSrc}
              alt="サムネイル"
              width="800"
              height="450"
              placeholder="blur"
              blurDataURL={imageSrc}
            />
            <div>
              <div className="ArticleListItem_title font-bold">{article.title}</div>
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
};

export default memo(SidebarArticleListItem);
