'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { UnifiedArticle } from '@/types/unified';
import WebpImage from '@/components/Common/Elements/WebpImage';
import styles from './index.module.css';
import { interactiveFocusClassName } from '@/components/Common/controlClassNames';

type Props = {
  recentArticles: UnifiedArticle[];
  currentArticleUrl?: string;
};

const normalizePath = (path?: string) => {
  return path?.replace(/\/$/, '');
};

export default function Recent({ recentArticles, currentArticleUrl }: Props) {
  const { theme } = useTheme();
  const normalizedCurrentArticleUrl = normalizePath(currentArticleUrl);
  const themeClassName = theme === 'dark' ? 'DarkTheme' : 'LightTheme';
  const linkClassName = `${styles.link} block border p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 ${interactiveFocusClassName} ${themeClassName}`;

  const sortedArticles = recentArticles
    .slice()
    .filter((article) => normalizePath(article.url) !== normalizedCurrentArticleUrl)
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <>
      <div className={`pt-8 px-4 border py-5 mt-5 ${themeClassName}`}>
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          最新記事
        </div>
        <ul className="mt-5 space-y-5">
          {sortedArticles.map((article) => {
            const isExternal = article.source === 'zenn';
            const articleContent = (
              <>
                {article.source === 'blog' && article.thumbnail && (
                  <WebpImage article={article} recent={true} />
                )}
                {article.source !== 'blog' && article.thumbnailUrl && (
                  <img
                    src={article.thumbnailUrl}
                    alt=""
                    className={styles.image}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className={`${styles.title} font-bold`}>{article.title}</div>
              </>
            );

            return (
              <li key={article.id}>
                {isExternal ? (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                    aria-label={`${article.title}を新しいタブで開く`}
                  >
                    {articleContent}
                  </a>
                ) : (
                  <Link href={article.url} className={linkClassName}>
                    {articleContent}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
