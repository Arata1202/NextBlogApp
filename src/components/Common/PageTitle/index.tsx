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
import { getPageHeadingLabel, type PageHeadingPage } from '../pageHeadingModel';

type Props = {
  page: PageHeadingPage;
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

export default function PageTitle({ page }: Props) {
  const Icon = PAGE_HEADING_ICONS[page.type];

  return (
    <>
      <h1
        className={`${(page.type === 'home' && styles.home) || styles.withBreadCrumbs} flex items-center pb-2 pt-2`}
      >
        <Icon className="h-8 w-8 mr-2" aria-hidden="true" />
        {getPageHeadingLabel(page)}
      </h1>
    </>
  );
}
