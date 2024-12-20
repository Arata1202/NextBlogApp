'use client';
import React, { memo } from 'react';
import Image from 'next/image';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import CategoryList from '../../Categories/CategoryList';
import PublishedDate from '../../Elements/Date';
import { FolderIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

type Props = {
  article: Article;
};

function getImageSrcSizes(imageSrc: string) {
  return {
    mobileSrcSet: `${imageSrc}?fm=webp&w=414 1x, ${imageSrc}?fm=webp&w=414&dpr=2 2x`,
    desktopSrcSet: `${imageSrc}?fm=webp&fit=crop&w=240&h=126 1x, ${imageSrc}?fm=webp&fit=crop&w=240&h=126&dpr=2 2x`,
  };
}

const ArticleListItem = ({ article }: Props) => {
  const imageSrc = article.thumbnail?.url || '/no-image.png';
  const isThumbnailAvailable = !!article.thumbnail;
  const { mobileSrcSet, desktopSrcSet } = getImageSrcSizes(imageSrc);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = `/articles/${article.id}`;
  };

  const { theme } = useTheme();

  return (
    <li className={styles.list}>
      <a
        onClick={handleClick}
        href={`/articles/${article.id}`}
        className={`${styles.link} p-2 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <picture>
          {isThumbnailAvailable && (
            <>
              <source type="image/webp" media="(max-width: 640px)" srcSet={mobileSrcSet} />
              <source type="image/webp" srcSet={desktopSrcSet} />
            </>
          )}
          <Image
            src={imageSrc}
            alt="サムネイル"
            className={styles.image}
            width="600"
            height="300"
            placeholder="blur"
            blurDataURL={imageSrc}
          />
        </picture>
        <div className={styles.content}>
          <div className={styles.title}>{article.title}</div>
          <div className={styles.description}>{article.description}</div>
          <div className={styles.date}>
            <FolderIcon className="h-5 w-5 mr-2 mt-4" aria-hidden="true" />
            <CategoryList tags={article.tags} hasLink={false} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <PublishedDate date={article.publishedAt || article.createdAt} />
          </div>
        </div>
      </a>
    </li>
  );
};

export default memo(ArticleListItem);
