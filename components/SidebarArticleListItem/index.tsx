//最適化済み

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
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

  return (
    <div>
      {/* <li className={styles.list}>
        <Link
          href={`/articles/${article.id}`}
          className={`${styles.link} p-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1`}
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
              width={isThumbnailAvailable ? article.thumbnail?.width : 900}
              height={isThumbnailAvailable ? article.thumbnail?.height : 450}
              width={isThumbnailAvailable ? article.thumbnail?.width : 1200}
              height={isThumbnailAvailable ? article.thumbnail?.height : 630}
              placeholder="blur"
              blurDataURL={imageSrc}
            />
          </picture>
          <div className={styles.content}>
            <div className={styles.title}>{article.title}</div>
            <div className={styles.description}>{article.description}</div>
            <div className={styles.date}>
              <FolderIcon className="h-5 w-5 mr-2 mt-3" aria-hidden="true" />
            <TagList tags={article.tags} hasLink={true} />
              &nbsp;&nbsp;&nbsp;&nbsp;
            <PublishedDate date={article.publishedAt || article.createdAt} />
            </div>
          </div>
        </Link>
      </li> */}
      <ol className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
        <li>
          <Link className="" href={`/articles/${article.id}`}>
            <Image
              src={imageSrc}
              alt="サムネイル"
              width="800"
              height="450"
              // width={isThumbnailAvailable ? article.thumbnail?.width : 1200}
              // height={isThumbnailAvailable ? article.thumbnail?.height : 630}
              placeholder="blur"
              blurDataURL={imageSrc}
            />
            <div>
              <div className="ArticleListItem_title font-bold">{article.title}</div>
            </div>
          </Link>
        </li>
      </ol>
    </div>
  );
};

export default memo(SidebarArticleListItem);
