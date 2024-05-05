import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import TagList from '../TagList';
import PublishedDate from '../Date';
import { FolderIcon } from '@heroicons/react/24/outline';

type Props = {
  article: Article;
};

export default function ArticleListItem({ article }: Props) {
  const imageSrc = article.thumbnail?.url || '/no-image.png';
  const isThumbnailAvailable = !!article.thumbnail;

  return (
    <li className={styles.list}>
      <Link
        href={`/articles/${article.id}`}
        className={`${styles.link} p-5 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1`}
      >
        <picture>
          {isThumbnailAvailable && (
            <>
              <source
                type="image/webp"
                media="(max-width: 640px)"
                srcSet={`${imageSrc}?fm=webp&w=414 1x, ${imageSrc}?fm=webp&w=414&dpr=2 2x`}
              />
              <source
                type="image/webp"
                srcSet={`${imageSrc}?fm=webp&fit=crop&w=240&h=126 1x, ${imageSrc}?fm=webp&fit=crop&w=240&h=126&dpr=2 2x`}
              />
            </>
          )}
          <Image
            src={imageSrc}
            alt=""
            className={styles.image}
            width={isThumbnailAvailable ? article.thumbnail?.width : 1200}
            height={isThumbnailAvailable ? article.thumbnail?.height : 630}
            placeholder="blur"
            blurDataURL={imageSrc}
          />
        </picture>
        <dl className={styles.content}>
          <dt className={styles.title}>{article.title}</dt>
          <dd className={styles.description}>{article.description}</dd>
          <dd className={styles.date}>
            <FolderIcon className="h-5 w-5 mr-2 mt-3" aria-hidden="true" />
            <TagList tags={article.tags} hasLink={true} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <PublishedDate date={article.publishedAt || article.createdAt} />
          </dd>
        </dl>
      </Link>
    </li>
  );
}
