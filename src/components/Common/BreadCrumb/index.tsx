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
};

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
}: Props) {
  return (
    <>
      <ul className="flex items-center space-x-4">
        <li>
          <Link href="/" className="flex text-gray-500 hover:text-blue-500">
            <HomeIcon className="h-4 w-4 flex-shrink-0" />
          </Link>
        </li>
        {article && (
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <Link
                href={`/category/${article.categories[0].id}`}
                className="whitespace-nowrap ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                {article.categories[0].name}
              </Link>
            </div>
          </li>
        )}
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
            {year && month && (
              <Link
                href={`/archive/${year}/${month}`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                {year}月{parseInt(month)}月
              </Link>
            )}
            {article && (
              <Link
                href={`${article.id}`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                {article.title}
              </Link>
            )}
            {category && (
              <Link
                href={`/category/${category.id}`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                {category.name}
              </Link>
            )}
            {tag && (
              <Link
                href={`/tag/${tag.id}`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                {tag.name}
              </Link>
            )}
            {contact && (
              <Link
                href={`/contact`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                お問い合わせ
              </Link>
            )}
            {copyright && (
              <Link
                href={`/copyright`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                著作権
              </Link>
            )}
            {disclaimer && (
              <Link
                href={`/disclaimer`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                免責事項
              </Link>
            )}
            {link && (
              <Link
                href={`/link`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                リンク
              </Link>
            )}
            {privacy && (
              <Link
                href={`/privacy`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                プライバシーポリシー
              </Link>
            )}
            {profile && (
              <Link
                href={`/profile`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                プロフィール
              </Link>
            )}
            {sitemap && (
              <Link
                href={`/sitemap-html`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                サイトマップ
              </Link>
            )}
          </div>
        </li>
      </ul>
    </>
  );
}
