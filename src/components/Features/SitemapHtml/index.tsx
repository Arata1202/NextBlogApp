'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Article, Category } from '@/types/microcms';
import { PAGE_ARR } from '@/constants/page';

type Props = {
  articles: Article[];
  categories: Category[];
};

export default function SitemapHtmlFeature({ articles, categories }: Props) {
  const { theme } = useTheme();
  const linkClassName =
    theme === 'dark'
      ? 'text-blue-300 underline underline-offset-2 hover:text-blue-200'
      : 'text-blue-700 underline underline-offset-2 hover:text-blue-800';

  return (
    <>
      <h2
        className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
      >
        固定ページ
      </h2>
      <ul>
        {PAGE_ARR.map((page) => (
          <li key={page.name}>
            <Link href={page.path} className={linkClassName}>
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
            <Link href={`/category/${category.id}`} className={linkClassName}>
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
            <Link href={`/articles/${article.id}`} className={linkClassName}>
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
