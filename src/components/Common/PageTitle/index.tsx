import {
  CalendarDaysIcon,
  FolderOpenIcon,
  HashtagIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  LinkIcon,
  LockClosedIcon,
  DocumentMagnifyingGlassIcon,
  UserCircleIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import { Category, Tag } from '@/types/microcms';
import styles from './index.module.css';

type Props = {
  year?: string;
  month?: string;
  category?: Category;
  tag?: Tag;
  home?: boolean;
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

export default function PageTitle({
  year,
  month,
  category,
  tag,
  home,
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
  const searchTitle = `「${searchKeyword ?? ''}」の検索結果`;

  return (
    <>
      <h1
        className={`${(home && styles.home) || styles.withBreadCrumbs} flex items-center pb-2 pt-2`}
      >
        {year && month && (
          <>
            <CalendarDaysIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            {year}年{parseInt(month)}月
          </>
        )}
        {category && (
          <>
            <FolderOpenIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            {category.name}
          </>
        )}
        {tag && (
          <>
            <HashtagIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            {tag.name}
          </>
        )}
        {home && (
          <>
            <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            最新記事
          </>
        )}
        {contact && (
          <>
            <EnvelopeIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            お問い合わせ
          </>
        )}
        {copyright && (
          <>
            <DocumentTextIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            著作権
          </>
        )}
        {disclaimer && (
          <>
            <ExclamationCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            免責事項
          </>
        )}
        {link && (
          <>
            <LinkIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            リンク
          </>
        )}
        {privacy && (
          <>
            <LockClosedIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            プライバシーポリシー
          </>
        )}
        {profile && (
          <>
            <UserCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            プロフィール
          </>
        )}
        {sitemap && (
          <>
            <DocumentMagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            サイトマップ
          </>
        )}
        {search && (
          <>
            <MagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            {searchTitle}
          </>
        )}
      </h1>
    </>
  );
}
