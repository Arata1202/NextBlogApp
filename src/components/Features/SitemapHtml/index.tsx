'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Article, Category } from '@/types/microcms';
import styles from './index.module.css';
import { PAGE_ARR } from '@/constants/page';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import FixedDateContainer from '@/components/Common/Layouts/Container/FIxedDateContainer';

type Props = {
  articles: Article[];
  categories: Category[];
};

export default function SitemapHtmlFeature({ articles, categories }: Props) {
  const { theme } = useTheme();

  const date = new Date(2023, 10, 27);

  return (
    <>
      <MainContainer>
        <ContentContainer>
          <div className="space-y-5 lg:space-y-8">
            <FixedDateContainer date={date} />
            <div className={`${styles.content} mt-10 mb-5`}>
              <h2
                className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                固定ページ
              </h2>
              <ul>
                {PAGE_ARR.map((page) => (
                  <li key={page.name}>
                    <Link href={page.path} className="text-blue-500 hover:text-blue-700">
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2
                className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                カテゴリー
              </h2>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2
                className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                投稿一覧
              </h2>
              <ul>
                {articles.map((article) => (
                  <li key={article.id}>
                    <a
                      href={`/articles/${article.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {article.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} />
      </MainContainer>
    </>
  );
}
