'use client';
import React, { memo } from 'react';
import Image from 'next/image';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import TagList from '../TagList';
import PublishedDate from '../Date';
import { FolderIcon } from '@heroicons/react/24/outline';

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

  return (
    <>
      <li className={styles.list}>
        <a
          onClick={handleClick}
          href={`/articles/${article.id}`}
          className={`${styles.link} p-2 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1`}
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
              <TagList tags={article.tags} hasLink={false} />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <PublishedDate date={article.publishedAt || article.createdAt} />
            </div>
          </div>
        </a>
      </li>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-format="fluid"
        data-ad-layout-key="-5k+co+1n-b5+e3"
        data-ad-client="ca-pub-1705865999592590"
        data-ad-slot="1678694276"
        data-full-width-responsive="false"
      ></ins>
    </>
  );
};

export default memo(ArticleListItem);
