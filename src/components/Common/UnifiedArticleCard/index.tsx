'use client';

import { SiteLink as Link } from '@/components/Common/AppWebViewLinkHandler';
import { useResolvedTheme } from '@/components/Common/useResolvedTheme';
import styles from '@/components/Common/ArticleCard/index.module.css';
import { UnifiedArticle } from '@/types/unified';
import DoubleDate from '../DoubleDate';
import WebpImage from '../Elements/WebpImage';
import { getThemeClassName, surfaceClassNames } from '@/styles/uiClassNames';
import SponsoredDisclosure from '../SponsoredDisclosure';

type Props = {
  article: UnifiedArticle;
  priority?: boolean;
};

export default function UnifiedArticleCard({ article, priority = false }: Props) {
  const theme = useResolvedTheme();
  const isExternal = article.source === 'zenn';
  const themeClassName = getThemeClassName(theme);

  return (
    <li className={styles.list}>
      <Link
        href={article.url}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`${styles.link} p-2 ${surfaceClassNames.card} ${themeClassName}`}
      >
        {article.source === 'blog' && article.thumbnail && (
          <WebpImage article={article} card={true} priority={priority} />
        )}
        {article.source !== 'blog' && article.thumbnailUrl && (
          <span className={styles.imageFrame}>
            <img
              className={styles.image}
              src={article.thumbnailUrl}
              alt=""
              width={1200}
              height={630}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : undefined}
            />
          </span>
        )}
        <div className={styles.content}>
          {article.isSponsored && <SponsoredDisclosure compact />}
          <div className={styles.title}>{article.title}</div>
          <div className={styles.description}>{article.description}</div>
          <DoubleDate article={article} />
        </div>
        {isExternal && <span className="sr-only">新しいタブで開く</span>}
      </Link>
    </li>
  );
}
