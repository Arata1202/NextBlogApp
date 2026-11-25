import { formatDate } from '@/utils/formatDate';
import styles from './index.module.css';
import SingleDate from '../SingleDate';

type Props = {
  article: {
    publishedAt?: string;
    updatedAt?: string;
  };
  articleMode?: boolean;
};

export default function DoubleDate({ article, articleMode = false }: Props) {
  if (!article.publishedAt) {
    return null;
  }

  const updated = article.updatedAt;
  const showUpdated =
    updated &&
    Date.parse(updated) > Date.parse(article.publishedAt) &&
    formatDate(updated) !== formatDate(article.publishedAt);

  return (
    <div className={articleMode ? `${styles.date} ${styles.articleMode}` : styles.date}>
      <SingleDate date={article.publishedAt} />
      {showUpdated && <SingleDate date={updated} updatedAt={true} />}
    </div>
  );
}
