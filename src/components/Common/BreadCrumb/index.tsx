import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { getPageHeadingLabel, type BreadCrumbPage } from '../pageHeadingModel';

type Props = {
  page: BreadCrumbPage;
};

const currentPageClassName = 'ml-4 text-sm font-medium text-gray-500';

const renderCurrentPage = (label: string) => (
  <span className={currentPageClassName} aria-current="page">
    {label}
  </span>
);

export default function BreadCrumb({ page }: Props) {
  return (
    <nav aria-label="パンくず">
      <ul className="flex items-center space-x-4">
        <li>
          <Link href="/" className="flex text-gray-500 hover:text-blue-600" aria-label="ホーム">
            <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </li>
        {page.type === 'article' && (
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <Link
                href={`/category/${page.article.categories[0].id}`}
                className="whitespace-nowrap ml-4 text-sm font-medium text-gray-500 hover:text-blue-600"
              >
                {page.article.categories[0].name}
              </Link>
            </div>
          </li>
        )}
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            {renderCurrentPage(getPageHeadingLabel(page))}
          </div>
        </li>
      </ul>
    </nav>
  );
}
