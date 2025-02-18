'use client';

import { useTheme } from 'next-themes';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import Display from '../../Adsense/Display';
import ArticleListItem from './Elements/ArticleListItem';
import TopSidebar from '../../Sidebars/TopSidebar';
import Share from '../../Elements/Share';

type Props = {
  articles: Article[];
};

export default function ArticleList({ articles }: Props) {
  const { theme } = useTheme();

  if (articles.length === 0) {
    return (
      <>
        <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
          <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
            <div className="lg:col-span-2">
              <div className="text-center py-7">
                <div
                  className={`my-4 text-3xl font-bold tracking-tight sm:text-5xl ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  記事はまだありません
                </div>
              </div>
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
      </>
    );
  }

  return (
    <>
      <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          <div className="lg:col-span-2">
            <ul className={styles.main}>
              <div>
                {articles.slice(0, 3).map((article) => (
                  <ArticleListItem key={article.id} article={article} />
                ))}
              </div>
              <div className="FirstAd">
                <Display slot="9947663897" />
              </div>
              <div className="mt-5">
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
    </>
  );
}
