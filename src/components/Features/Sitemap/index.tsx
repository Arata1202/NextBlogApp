'use client';

import { useTheme } from 'next-themes';
import { Article, Category } from '@/libs/microcms';
import styles from './index.module.css';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import SingleDate from '@/components/Common/SingleDate';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import AdAlert from '../../Common/AdAlert';

type Props = {
  articles: Article[];
  categories: Category[];
};

export default function SitemapFeature({ articles, categories }: Props) {
  const { theme } = useTheme();

  const dummyDate = new Date(2023, 10, 27);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const pages = [
    { name: 'お問い合わせ', href: '/contact' },
    { name: 'サイトマップ', href: '/sitemap' },
    { name: 'プロフィール', href: '/profile' },
    { name: 'プライバシーポリシー', href: '/privacy' },
    { name: '免責事項', href: '/disclaimer' },
    { name: '著作権', href: '/copyright' },
    { name: 'リンク', href: '/link' },
  ];

  return (
    <>
      <MainContainer>
        <ContentContainer>
          <div className="space-y-5 lg:space-y-8">
            <div className="flex justify-end gap-x-5">
              <SingleDate date={formattedDate} />
            </div>
            <AdAlert />
            <div className={`${styles.content} mt-10 mb-5`}>
              <h2
                className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                固定ページ
              </h2>
              <ul>
                {pages.map((page) => (
                  <li key={page.name}>
                    <a href={page.href} className="text-blue-500 hover:text-blue-700">
                      {page.name}
                    </a>
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
                    <a
                      href={`/category/${category.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {category.name}
                    </a>
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
        <Sidebar recentArticles={articles} mobile={false} />
      </MainContainer>
    </>
  );
}
