import {
  CalendarDaysIcon,
  FolderOpenIcon,
  HashtagIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  LinkIcon,
  LockClosedIcon,
  UserCircleIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import { Category, Tag } from '@/libs/microcms';

type Props = {
  year?: string;
  month?: string;
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

export default function PageTitle({
  year,
  month,
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
      <h1 className="flex items-center pb-2 pt-2 mt-5">
        {year && month && (
          <>
            <CalendarDaysIcon className="h-8 w-8 mr-2" />
            <div>
              {year}年{parseInt(month || '')}月
            </div>
          </>
        )}
        {category && (
          <>
            <FolderOpenIcon className="h-8 w-8 mr-2" />
            <div>{category.name}</div>
          </>
        )}
        {tag && (
          <>
            <HashtagIcon className="h-8 w-8 mr-2" />
            <div>{tag.name}</div>
          </>
        )}
        {contact && (
          <>
            <EnvelopeIcon className="h-8 w-8 mr-2" />
            <div>お問い合わせ</div>
          </>
        )}
        {copyright && (
          <>
            <DocumentTextIcon className="h-8 w-8 mr-2" />
            <div>著作権</div>
          </>
        )}
        {disclaimer && (
          <>
            <ExclamationCircleIcon className="h-8 w-8 mr-2" />
            <div>免責事項</div>
          </>
        )}
        {link && (
          <>
            <LinkIcon className="h-8 w-8 mr-2" />
            <div>リンク</div>
          </>
        )}
        {privacy && (
          <>
            <LockClosedIcon className="h-8 w-8 mr-2" />
            <div>プライバシーポリシー</div>
          </>
        )}
        {profile && (
          <>
            <UserCircleIcon className="h-8 w-8 mr-2" />
            <div>プロフィール</div>
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
