import { CalendarDaysIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import { Category } from '@/libs/microcms';

type Props = {
  year?: string;
  month?: string;
  category?: Category;
};

export default function PageTitle({ year, month, category }: Props) {
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
      </h1>
    </>
  );
}
