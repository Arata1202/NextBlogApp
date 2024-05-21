//最適化済み

import React from 'react';
import { Article, Tag } from '@/libs/microcms';
import ArticleListItem from '../ArticleListItem';
import styles from './index.module.css';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import Sidebar from '../Sidebar';
import Share from '../Share';

const tabs = [
  { name: '最新記事', href: '/', current: false },
  { name: '大学生活', href: '/category/university', current: false },
  { name: 'プログラミング', href: '/category/programming', current: false },
];

function classNames(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

type Props = {
  articles?: Article[];
  allArticles?: Article[];
};

const ArticleList = ({ articles, allArticles }: Props) => {
  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<Tag>();
    articles?.forEach((article) => {
      article.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [articles]);

  const showLatest = uniqueTags.length > 1;

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="">
              <nav
                className="isolate flex divide-x divide-gray-300 border border-gray-300 shadow"
                aria-label="Tabs"
              >
                {tabs.map((tab, tabIdx) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current ? 'text-gray-900' : 'text-gray-800 hover:text-blue-500',
                      tabIdx === 0 ? 'rounded-l-lg' : '',
                      tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                      'tabItem group relative min-w-0 flex-1 overflow-hidden bg-white py-4 text-center text-sm font-medium focus:z-10',
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                  >
                    <span className="font-bold">{tab.name}</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        tab.current ? 'bg-indigo-500' : 'bg-transparent',
                        'absolute inset-x-0 bottom-0 h-0.5',
                      )}
                    />
                  </a>
                ))}
              </nav>
            </div>
            <div className="text-center pt-7">
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                記事はまだありません
              </h1>
            </div>
          </div>
          <Sidebar articles={articles} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
      {/* <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div> */}
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* <h1 className="categoryTitle text-3xl font-bold pt-7">
            {showLatest ? (
              <div className="flex items-center pb-2 pt-2">
                <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                <div>最新記事</div>
              </div>
            ) : (
              <div className="flex items-center">
                <FolderOpenIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                <TagList tags={uniqueTags} hasLink={false} />
              </div>
            )}
          </h1> */}
          <div className="">
            <nav
              className="isolate flex divide-x divide-gray-300 border border-gray-300 shadow"
              aria-label="Tabs"
            >
              {tabs.map((tab, tabIdx) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current ? 'text-gray-900' : 'text-gray-800 hover:text-blue-500',
                    tabIdx === 0 ? 'rounded-l-lg' : '',
                    tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                    'tabItem group relative min-w-0 flex-1 overflow-hidden bg-white py-4 text-center text-sm font-medium focus:z-10',
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  <span className="font-bold">{tab.name}</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      tab.current ? 'bg-indigo-500' : 'bg-transparent',
                      'absolute inset-x-0 bottom-0 h-0.5',
                    )}
                  />
                </a>
              ))}
            </nav>
          </div>
          <ul className={`${styles.main}`}>
            {articles.map((article) => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </ul>
          <Share />
        </div>
        <div className="mobile">
          <Sidebar articles={allArticles || articles} />
        </div>
      </div>
    </div>
  );
};
export default React.memo(ArticleList);
