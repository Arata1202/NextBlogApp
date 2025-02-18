import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

type Props = {
  year?: string;
  month?: string;
};

export default function BreadCrumb({ year, month }: Props) {
  return (
    <>
      <ul className="flex items-center space-x-4">
        <li>
          <a href="/" className="flex text-gray-500 hover:text-blue-500">
            <HomeIcon className="h-4 w-4 flex-shrink-0" />
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <a
              href={`/archive/${year}/${month}`}
              className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
            >
              {year}月{parseInt(month || '')}月
            </a>
          </div>
        </li>
      </ul>
    </>
  );
}
