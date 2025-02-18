import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Category } from '@/libs/microcms';

type Props = {
  year?: string;
  month?: string;
  category?: Category;
  contact?: boolean;
};

export default function BreadCrumb({ year, month, category, contact }: Props) {
  return (
    <>
      <ul className="flex items-center space-x-4">
        <li>
          <a href="/" className="flex text-gray-500 hover:text-blue-500">
            <HomeIcon className="h-4 w-4 flex-shrink-0" />
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
            {year && month && (
              <a
                href={`/archive/${year}/${month}`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                {year}月{parseInt(month || '')}月
              </a>
            )}
            {category && (
              <a
                href={`/category/${category.id}`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                {category.name}
              </a>
            )}
            {contact && (
              <a
                href={`/contact`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
              >
                お問い合わせ
              </a>
            )}
          </div>
        </li>
      </ul>
    </>
  );
}
