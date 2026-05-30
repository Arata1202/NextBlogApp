import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Article, Category, Tag } from '@/types/microcms';

type Props = {
  year?: string;
  month?: string;
  article?: Article;
  category?: Category;
  tag?: Tag;
  contact?: boolean;
  copyright?: boolean;
  disclaimer?: boolean;
  link?: boolean;
  privacy?: boolean;
  profile?: boolean;
  sitemap?: boolean;
  search?: boolean;
  searchKeyword?: string;
};

const currentPageClassName = 'ml-4 text-sm font-medium text-gray-500';

const renderCurrentPage = (label: string) => (
  <span className={currentPageClassName} aria-current="page">
    {label}
  </span>
);

export default function BreadCrumb({
  year,
  month,
  article,
  category,
  tag,
  contact,
  copyright,
  disclaimer,
  link,
  privacy,
  profile,
  sitemap,
  search,
  searchKeyword,
}: Props) {
  const searchLabel = `「${searchKeyword ?? ''}」の検索結果`;

  return (
    <nav aria-label="パンくず">
      <ul className="flex items-center space-x-4">
        <li>
          <Link href="/" className="flex text-gray-500 hover:text-blue-600" aria-label="ホーム">
            <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          </Link>
        </li>
        {article && (
          <li>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-4 w-4 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <Link
                href={`/category/${article.categories[0].id}`}
                className="whitespace-nowrap ml-4 text-sm font-medium text-gray-500 hover:text-blue-600"
              >
                {article.categories[0].name}
              </Link>
            </div>
          </li>
        )}
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {year && month && renderCurrentPage(`${year}年${parseInt(month, 10)}月`)}
            {article && renderCurrentPage(article.title)}
            {category && renderCurrentPage(category.name)}
            {tag && renderCurrentPage(tag.name)}
            {contact && renderCurrentPage('お問い合わせ')}
            {copyright && renderCurrentPage('著作権')}
            {disclaimer && renderCurrentPage('免責事項')}
            {link && renderCurrentPage('リンク')}
            {privacy && renderCurrentPage('プライバシーポリシー')}
            {profile && renderCurrentPage('プロフィール')}
            {sitemap && renderCurrentPage('サイトマップ')}
            {search && renderCurrentPage(searchLabel)}
          </div>
        </li>
      </ul>
    </nav>
  );
}
