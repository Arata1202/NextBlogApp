'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Article, Category } from '@/types/microcms';
import { PAGE_ARR } from '@/constants/page';
import { getTextLinkClassName } from '@/components/Common/controlClassNames';
import { getThemeVariantClassName, themeVariantClassNames } from '@/styles/designTokens';

type Props = {
  articles: Article[];
  categories: Category[];
};

export default function SitemapHtmlFeature({ articles, categories }: Props) {
  const { theme } = useTheme();
  const linkClassName = getTextLinkClassName(theme);
  const selectedSurfaceClassName = getThemeVariantClassName(
    theme,
    themeVariantClassNames.selectedSurface,
  );

  return (
    <>
      <h2 className={selectedSurfaceClassName}>固定ページ</h2>
      <ul>
        {PAGE_ARR.map((page) => (
          <li key={page.name}>
            <Link href={page.path} className={linkClassName}>
              {page.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className={selectedSurfaceClassName}>カテゴリー</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/category/${category.id}`} className={linkClassName}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className={selectedSurfaceClassName}>投稿一覧</h2>
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
