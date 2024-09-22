import React from 'react';
import { Article } from '@/libs/microcms';
import ArticleListItem from '../ArticleListItem';
import styles from './index.module.css';
import TopSidebar from '../TopSidebar';
import Share from '../Share';
import Display from '../Adsense/display';

type Props = {
  articles?: Article[];
};

const ArticleList = ({ articles }: Props) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="text-center pt-7">
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
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
          <div className="FirstAd">
            <Display slot="7197259627" />
          </div>
          <ul className={`${styles.main}`}>
            <div>
              {articles.map((article) => (
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
