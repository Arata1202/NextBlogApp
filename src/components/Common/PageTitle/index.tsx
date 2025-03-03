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
}: Props) {
  return (
    <>
      <h1
        className={`${(home && styles.home) || styles.withBreadCrumbs} flex items-center pb-2 pt-2`}
      >
        {year && month && (
          <>
            <CalendarDaysIcon className="h-8 w-8 mr-2" />
            {year}年{parseInt(month)}月
          </>
        )}
        {category && (
          <>
            <FolderOpenIcon className="h-8 w-8 mr-2" />
            {category.name}
          </>
        )}
        {tag && (
          <>
            <HashtagIcon className="h-8 w-8 mr-2" />
            {tag.name}
          </>
        )}
        {home && (
          <>
            <BellAlertIcon className="h-8 w-8 mr-2" />
            最新記事
          </>
        )}
        {contact && (
          <>
            <EnvelopeIcon className="h-8 w-8 mr-2" />
            お問い合わせ
          </>
        )}
        {copyright && (
          <>
            <DocumentTextIcon className="h-8 w-8 mr-2" />
            著作権
          </>
        )}
        {disclaimer && (
          <>
            <ExclamationCircleIcon className="h-8 w-8 mr-2" />
            免責事項
          </>
        )}
        {link && (
          <>
            <LinkIcon className="h-8 w-8 mr-2" />
            リンク
          </>
        )}
        {privacy && (
          <>
            <LockClosedIcon className="h-8 w-8 mr-2" />
            プライバシーポリシー
          </>
        )}
        {profile && (
          <>
            <UserCircleIcon className="h-8 w-8 mr-2" />
            プロフィール
          </>
        )}
        {sitemap && (
          <>
            <DocumentMagnifyingGlassIcon className="h-8 w-8 mr-2" />
            <div>サイトマップ</div>
          </>
        )}
      </h1>
    </>
  );
}
