import {
  CalendarDaysIcon,
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  FolderOpenIcon,
  HashtagIcon,
  LinkIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  BellAlertIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import type { ComponentType, SVGProps } from 'react';
import styles from './index.module.css';
import SearchResultLabelSkeleton from '../SearchResultLabelSkeleton';
import { getPageHeadingLabel, type PageHeadingPage } from '../pageHeadingModel';

type Props = {
  page: PageHeadingPage;
  isLoading?: boolean;
};

type HeadingIcon = ComponentType<SVGProps<SVGSVGElement>>;

const PAGE_HEADING_ICONS: Record<PageHeadingPage['type'], HeadingIcon> = {
  archive: CalendarDaysIcon,
  category: FolderOpenIcon,
  tag: HashtagIcon,
  home: BellAlertIcon,
  contact: EnvelopeIcon,
  copyright: DocumentTextIcon,
  disclaimer: ExclamationCircleIcon,
  link: LinkIcon,
  privacy: LockClosedIcon,
  profile: UserCircleIcon,
  sitemap: DocumentMagnifyingGlassIcon,
  search: MagnifyingGlassIcon,
};

export default function PageTitle({ page, isLoading = false }: Props) {
  const Icon = PAGE_HEADING_ICONS[page.type];
  const isSearchLoading = page.type === 'search' && isLoading;

  return (
    <>
      <h1
        className={`${(page.type === 'home' && styles.home) || styles.withBreadCrumbs} flex items-center pb-2 pt-2`}
        aria-label={isLoading ? 'ページタイトルを読み込み中' : undefined}
      >
        <Icon className="h-8 w-8 mr-2" aria-hidden="true" />
        {isSearchLoading ? (
          <SearchResultLabelSkeleton variant="title" />
        ) : isLoading ? (
          <span
            className="inline-block h-8 w-56 max-w-[70vw] animate-pulse rounded bg-gray-300/70 align-middle"
            aria-hidden="true"
          />
        ) : (
          getPageHeadingLabel(page)
        )}
      </h1>
    </>
  );
}
