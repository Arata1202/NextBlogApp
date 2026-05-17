'use client';

import { useTheme } from 'next-themes';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { UnifiedArticle } from '@/types/unified';
import WebpImage from '@/components/Common/Elements/WebpImage';
import styles from './index.module.css';

type Props = {
  recentArticles: UnifiedArticle[];
};

export default function Recent({ recentArticles }: Props) {
  const { theme } = useTheme();

  const sortedArticles = recentArticles
    .slice()
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <>
      <div
        className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <BellAlertIcon className="h-8 w-8 mr-2" />
          最新記事
        </div>
        {sortedArticles.map((article) => {
          const isExternal = article.source === 'zenn';
          return (
            <ul
              key={article.id}
              className={`border mt-5 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              <li>
                <a
                  href={article.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={styles.link}
                >
                  {article.source === 'blog' && article.thumbnail && (
                    <WebpImage article={article} recent={true} />
                  )}
                  {article.source !== 'blog' && article.thumbnailUrl && (
                    <img
                      src={article.thumbnailUrl}
                      alt={article.title}
                      className={styles.image}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className={`${styles.title} font-bold`}>{article.title}</div>
                </a>
              </li>
            </ul>
          );
        })}
      </div>
    </>
  );
}
