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
  recentArticles?: Article[];
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
  const displayArticles = mixedArticles ?? articles;

  return (
    <>
      <MainContainer>
        <ContentContainer>
          {displayArticles.length === 0 && (
            <div className="text-center py-7">
              <div
                className={`my-4 text-3xl font-bold tracking-tight sm:text-5xl ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                記事はまだありません
              </div>
            </div>
          )}
          {displayArticles.length > 0 && (
            <ul className={styles.main}>
              {displayArticles
                .slice(0, 3)
                .map((article) =>
                  isMixed ? (
                    <UnifiedArticleCard key={article.id} article={article} />
                  ) : (
                    <ArticleCard key={article.id} article={article as Article} />
                  ),
                )}
              <AdUnit slot="9947663897" style={{ marginBottom: '1.25rem' }} />
              {displayArticles
                .slice(3)
                .map((article) =>
                  isMixed ? (
                    <UnifiedArticleCard key={article.id} article={article} />
                  ) : (
                    <ArticleCard key={article.id} article={article as Article} />
                  ),
                )}
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
