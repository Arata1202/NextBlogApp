import {
  CalendarDaysIcon,
  FolderOpenIcon,
  EnvelopeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';
import { Category } from '@/libs/microcms';

type Props = {
  year?: string;
  month?: string;
  category?: Category;
  contact?: boolean;
  copyright?: boolean;
};

export default function PageTitle({ year, month, category, contact, copyright }: Props) {
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
      </h1>
    </>
  );
}
