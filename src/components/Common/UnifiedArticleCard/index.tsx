'use client';

import { useTheme } from 'next-themes';
import styles from '@/components/Common/ArticleCard/index.module.css';
import { UnifiedArticle } from '@/types/unified';
import SingleDate from '@/components/Common/SingleDate';
import doubleDateStyles from '@/components/Common/DoubleDate/index.module.css';
import WebpImage from '../Elements/WebpImage';

type Props = {
  article: UnifiedArticle;
};

export default function UnifiedArticleCard({ article }: Props) {
  const { theme } = useTheme();
  const isExternal = article.source === 'zenn';

  const isNextDayOrLater = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1 > d2;
  };
  const showUpdated = article.updatedAt && isNextDayOrLater(article.updatedAt, article.publishedAt);

  return (
    <li className={styles.list}>
      <a
        href={article.url}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`${styles.link} p-2 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        {article.source === 'blog' && article.thumbnail && (
          <WebpImage article={article} card={true} />
        )}
        {article.source !== 'blog' && article.thumbnailUrl && (
          <img
            className={styles.image}
            src={article.thumbnailUrl}
            alt={article.title}
            loading="lazy"
            decoding="async"
            style={{ alignSelf: 'flex-start' }}
          />
        )}
        <div className={styles.content}>
          <div className={styles.title}>{article.title}</div>
          <div className={styles.description}>{article.description}</div>
          <div className={doubleDateStyles.date}>
            <SingleDate date={article.publishedAt} />
            {showUpdated && <SingleDate date={article.updatedAt!} updatedAt={true} />}
          </div>
        </div>
      </a>
    </li>
  );
}
