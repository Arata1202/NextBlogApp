'use client';

import { useTheme } from 'next-themes';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import Display from '../ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import ArticleCard from '../ArticleCard';
import Sidebar from '../Layouts/Sidebar';
import Share from '../Share';

type Props = {
  articles: Article[];
  recentArticles?: Article[];
};

export default function ArticleList({ articles, recentArticles }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <MainContainer>
        <ContentContainer>
          {articles.length === 0 && (
            <div className="text-center py-7">
              <div
                className={`my-4 text-3xl font-bold tracking-tight sm:text-5xl ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                記事はまだありません
              </div>
            </div>
          )}
          {articles.length > 0 && (
            <ul className={styles.main}>
              <div>
                {articles.slice(0, 3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <div className="FirstAd">
                <Display slot="9947663897" />
              </div>
              <div className="mt-5">
                {articles.slice(3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </ul>
          )}
          <div className="FirstAd">
            <Display slot="1831092739" />
          </div>
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={recentArticles} mobile={false} />
      </MainContainer>
    </>
  );
}
