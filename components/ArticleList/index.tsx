import React from 'react';
import { Article, Tag } from '@/libs/microcms';
import ArticleListItem from '../ArticleListItem';
import styles from './index.module.css';
import { useMemo } from 'react';
import TopSidebar from '../TopSidebar';
import Share from '../Share';
import Script from 'next/script';

// const tabs = [
//   { name: '最新記事', href: '/', current: false },
//   { name: '大学生活', href: '/category/university', current: false },
//   { name: 'プログラミング', href: '/category/programming', current: false },
// ];

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
            {/* <div className="">
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
            </div> */}
            <div className="text-center pt-7">
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                記事はまだありません
              </h1>
            </div>
          </div>
          <TopSidebar articles={articles} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* <div className="">
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
          </div> */}
          <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%' }}
              data-ad-client="ca-pub-1705865999592590"
              data-ad-slot="7197259627"
              data-ad-format="auto"
              data-full-width-responsive="false"
            ></ins>
            <Script id="adsbygoogle-init" strategy="afterInteractive">
              {`
          (adsbygoogle = window.adsbygoogle || []).push({});
        `}
            </Script>
          </div>
          <ul className={`${styles.main}`}>
            {articles.map((article) => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </ul>
          <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%' }}
              data-ad-client="ca-pub-1705865999592590"
              data-ad-slot="7197259627"
              data-ad-format="auto"
              data-full-width-responsive="false"
            ></ins>
            <Script id="adsbygoogle-init" strategy="afterInteractive">
              {`
          (adsbygoogle = window.adsbygoogle || []).push({});
        `}
            </Script>
          </div>
          <Share />
        </div>
        <div className="mobile">
          <TopSidebar articles={allArticles || articles} />
        </div>
      </div>
    </div>
  );
};
export default React.memo(ArticleList);
