import type { Article, Category, Tag } from '@/types/microcms';

export type PageHeadingPage =
  | { type: 'archive'; year: string; month: string }
  | { type: 'category'; category: Category }
  | { type: 'tag'; tag: Tag }
  | { type: 'home' }
  | { type: 'contact' }
  | { type: 'copyright' }
  | { type: 'disclaimer' }
  | { type: 'link' }
  | { type: 'privacy' }
  | { type: 'profile' }
  | { type: 'sitemap' }
  | { type: 'search'; searchKeyword?: string };

export type BreadCrumbPage =
  | Exclude<PageHeadingPage, { type: 'home' }>
  | {
      type: 'article';
      article: Article;
    };

const assertNever = (value: never): never => {
  throw new Error(`Unsupported page heading type: ${JSON.stringify(value)}`);
};

export const getPageHeadingLabel = (page: PageHeadingPage | BreadCrumbPage): string => {
  switch (page.type) {
    case 'archive':
      return `${page.year}年${parseInt(page.month, 10)}月`;
    case 'article':
      return page.article.title;
    case 'category':
      return page.category.name;
    case 'tag':
      return page.tag.name;
    case 'home':
      return '最新記事';
    case 'contact':
      return 'お問い合わせ';
    case 'copyright':
      return '著作権';
    case 'disclaimer':
      return '免責事項';
    case 'link':
      return 'リンク';
    case 'privacy':
      return 'プライバシーポリシー';
    case 'profile':
      return 'プロフィール';
    case 'sitemap':
      return 'サイトマップ';
    case 'search':
      return page.searchKeyword ? `「${page.searchKeyword}」の検索結果` : '検索結果';
    default:
      return assertNever(page);
  }
};
