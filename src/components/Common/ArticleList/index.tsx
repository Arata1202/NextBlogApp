'use client';

import { useTheme } from 'next-themes';
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
};

export default function ArticleList({
  articles,
  recentArticles,
  tags,
  archiveList,
  mixedArticles,
}: Props) {
  const { theme } = useTheme();
  const isMixed = Boolean(mixedArticles);

  return (
    <>
      <MainContainer>
        <ContentContainer>
          {!isMixed && articles.length === 0 && (
            <div className="text-center py-7">
              <div
                className={`my-4 text-3xl font-bold tracking-tight sm:text-5xl ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                記事はまだありません
              </div>
            </div>
          )}
          {isMixed && mixedArticles && mixedArticles.length === 0 && (
            <div className="text-center py-7">
              <div
                className={`my-4 text-3xl font-bold tracking-tight sm:text-5xl ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                記事はまだありません
              </div>
            </div>
          )}
          {!isMixed && articles.length > 0 && (
            <ul className={styles.main}>
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
              <AdUnit slot="9947663897" style={{ marginBottom: '1.25rem' }} />
              {articles.slice(3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </ul>
          )}
          {isMixed && mixedArticles && mixedArticles.length > 0 && (
            <ul className={styles.main}>
              {mixedArticles.slice(0, 3).map((article) => (
                <UnifiedArticleCard key={article.id} article={article} />
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
