'use client';
import { useTheme } from 'next-themes';
import React from 'react';
import Image from 'next/image';
import { memo } from 'react';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import PublishedDate from '../../../Elements/Date';

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

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    event.preventDefault();
    window.location.href = url;
  };

  const { theme } = useTheme();

  const isNextDayOrLater = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1 > d2;
  };

  return (
    <li className={styles.list}>
      <a
        onClick={(event) => handleNavigation(event, `/articles/${article.id}`)}
        href={`/articles/${article.id}`}
        className={`${styles.link} p-2 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 cursor-pointer ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
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
  );
};

export default memo(ArticleListItem);
