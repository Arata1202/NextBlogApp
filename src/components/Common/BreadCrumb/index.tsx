import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import SearchResultLabelSkeleton from '../SearchResultLabelSkeleton';
import { getPageHeadingLabel, type BreadCrumbPage } from '../pageHeadingModel';
import { colorClassNames } from '@/styles/designTokens';

type Props = {
  page: BreadCrumbPage;
  isLoading?: boolean;
};

const breadcrumbItemClassName = 'min-w-0';
const breadcrumbCurrentItemClassName = `${breadcrumbItemClassName} flex-1`;
const breadcrumbSegmentClassName = 'flex min-w-0 items-center';
const currentPageClassName =
  'ml-4 min-w-0 flex-1 text-sm font-medium text-gray-500 [overflow-wrap:anywhere]';
const breadcrumbLinkClassName = `text-gray-500 ${colorClassNames.accentHoverText}`;

const renderCurrentPage = (label: string, isLoading: boolean) => (
  <span
    className={currentPageClassName}
    aria-current="page"
    aria-label={isLoading ? '現在のページを読み込み中' : undefined}
  >
    {isLoading ? (
      <span
        className="inline-block h-4 w-28 animate-pulse rounded bg-gray-300/70 align-middle"
        aria-hidden="true"
      />
    ) : (
      label
    )}
  </span>
);

export default function BreadCrumb({ page, isLoading = false }: Props) {
  const isSearchLoading = page.type === 'search' && isLoading;

  return (
    <nav aria-label="パンくず">
      <ul className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
        <li className={breadcrumbItemClassName}>
          <Link href="/" className={`flex ${breadcrumbLinkClassName}`} aria-label="ホーム">
            <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </li>
        {page.type === 'article' && (
          <li className={breadcrumbItemClassName}>
            <div className={breadcrumbSegmentClassName}>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <Link
                href={`/category/${page.article.categories[0].id}`}
                className={`whitespace-nowrap ml-4 text-sm font-medium ${breadcrumbLinkClassName}`}
              >
                {page.article.categories[0].name}
              </Link>
            </div>
          </li>
        )}
        <li className={breadcrumbCurrentItemClassName}>
          <div className={breadcrumbSegmentClassName}>
            <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            {isSearchLoading ? (
              <span
                className={currentPageClassName}
                aria-current="page"
                aria-label="現在のページを読み込み中"
              >
                <SearchResultLabelSkeleton variant="breadcrumb" />
              </span>
            ) : (
              renderCurrentPage(getPageHeadingLabel(page), isLoading)
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
}
