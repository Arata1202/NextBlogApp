import { Article } from '@/types/microcms';
import styles from './index.module.css';
import SingleDate from '../SingleDate';

type Props = {
  article: Article;
  articleMode?: boolean;
};

export default function DoubleDate({ article, articleMode = false }: Props) {
  const isNextDayOrLater = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1 > d2;
  };

  return (
    <div className={`${styles.date} ${articleMode && styles.articleMode}`}>
      <SingleDate date={article.publishedAt!} />
      {article.updatedAt && isNextDayOrLater(article.updatedAt, article.publishedAt!) && (
        <SingleDate date={article.updatedAt} updatedAt={true} />
      )}
    </div>
  );
}
