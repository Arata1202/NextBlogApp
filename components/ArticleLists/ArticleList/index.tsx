'use client';
import React from 'react';
import { Article } from '@/libs/microcms';
import ArticleListItem from '../ArticleListItem';
import styles from './index.module.css';
import TopSidebar from '../../Sidebars/TopSidebar';
import Share from '../../Elements/Share';
import Display from '../../Adsense/Display';
import { useTheme } from 'next-themes';

type Props = {
  articles?: Article[];
};

const ArticleList = ({ articles }: Props) => {
  const { theme } = useTheme();
  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="text-center pt-7">
              <h1
                className={`mt-4 text-3xl font-bold tracking-tight sm:text-5xl ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                記事はまだありません
              </h1>
            </div>
          </div>
          <TopSidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* <div className="FirstAd">
            <Display slot="7197259627" />
          </div> */}
          <ul className={`${styles.main}`}>
            <div>
              {articles.slice(0, 3).map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
            <div className="FirstAd mb-5">
              <Display slot="9947663897" />
            </div>
            <div>
              {articles.slice(3).map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
          </ul>
          <div className="FirstAd">
            <Display slot="1831092739" />
          </div>
          <Share />
        </div>
        <div className="mobile">
          <TopSidebar />
        </div>
      </div>
    </div>
  );
};
export default React.memo(ArticleList);
