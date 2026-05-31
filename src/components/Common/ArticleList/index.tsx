'use client';

import { useTheme } from 'next-themes';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Article, Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import styles from './index.module.css';
import AdUnit from '../../ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import ArticleCard from '../ArticleCard';
import UnifiedArticleCard from '../UnifiedArticleCard';
import Sidebar from '../Layouts/Sidebar';
import Share from '../Share';
import { UnifiedArticle } from '@/types/unified';

type Props = {
  articles: Article[];
  recentArticles?: UnifiedArticle[];
  tags: Tag[];
  archiveList: ArchiveItem[];
  mixedArticles?: UnifiedArticle[];
  emptyMessage?: string;
  isLoading?: boolean;
};

const skeletonItems = [0, 1, 2];

function EmptyState({ message, theme }: { message: string; theme?: string }) {
  const colorClassName = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className="py-10 text-center">
      <DocumentTextIcon className="mx-auto mb-2 h-7 w-7 text-gray-400" aria-hidden="true" />
      <p className={`text-sm font-medium ${colorClassName}`}>{message}</p>
    </div>
  );
}

export default function ArticleList({
  articles,
  recentArticles,
  tags,
  archiveList,
  mixedArticles,
  emptyMessage = '記事はまだありません',
  isLoading = false,
}: Props) {
  const { theme } = useTheme();
  const isMixed = Boolean(mixedArticles);

  return (
    <>
      <MainContainer>
        <ContentContainer>
          {isLoading && (
            <ul className={styles.main} aria-label="記事を読み込み中">
              {skeletonItems.map((item) => (
                <li key={item} className={styles.skeletonList} data-testid="article-skeleton">
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLineShort} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && !isMixed && articles.length === 0 && (
            <EmptyState message={emptyMessage} theme={theme} />
          )}
          {!isLoading && isMixed && mixedArticles && mixedArticles.length === 0 && (
            <EmptyState message={emptyMessage} theme={theme} />
          )}
          {!isLoading && !isMixed && articles.length > 0 && (
            <ul className={styles.main}>
              {articles.slice(0, 3).map((article, index) => (
                <ArticleCard key={article.id} article={article} priority={index === 0} />
              ))}
              <AdUnit slot="9947663897" style={{ marginBottom: '1.25rem' }} />
              {articles.slice(3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </ul>
          )}
          {!isLoading && isMixed && mixedArticles && mixedArticles.length > 0 && (
            <ul className={styles.main}>
              {mixedArticles.slice(0, 3).map((article, index) => (
                <UnifiedArticleCard key={article.id} article={article} priority={index === 0} />
              ))}
              <AdUnit slot="9947663897" style={{ marginBottom: '1.25rem' }} />
              {mixedArticles.slice(3).map((article) => (
                <UnifiedArticleCard key={article.id} article={article} />
              ))}
            </ul>
          )}
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
      </MainContainer>
    </>
  );
}
