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

const getPageHeadingIcon = (page: PageHeadingPage): HeadingIcon => {
  switch (page.type) {
    case 'archive':
      return CalendarDaysIcon;
    case 'category':
      return FolderOpenIcon;
    case 'tag':
      return HashtagIcon;
    case 'home':
      return BellAlertIcon;
    case 'contact':
      return EnvelopeIcon;
    case 'copyright':
      return DocumentTextIcon;
    case 'disclaimer':
      return ExclamationCircleIcon;
    case 'link':
      return LinkIcon;
    case 'privacy':
      return LockClosedIcon;
    case 'profile':
      return UserCircleIcon;
    case 'sitemap':
      return DocumentMagnifyingGlassIcon;
    case 'search':
      return MagnifyingGlassIcon;
  }
};

export default function PageTitle({ page }: Props) {
  const Icon = getPageHeadingIcon(page);

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
