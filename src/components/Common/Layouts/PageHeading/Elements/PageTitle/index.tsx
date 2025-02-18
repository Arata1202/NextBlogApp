import { CalendarDaysIcon } from '@heroicons/react/24/solid';

type Props = {
  year?: string;
  month?: string;
};

export default function PageTitle({ year, month }: Props) {
  return (
    <>
      <h1 className="flex items-center pb-2 pt-2 mt-5">
        <CalendarDaysIcon className="h-8 w-8 mr-2" />
        <div>
          {year}年{parseInt(month || '')}月
        </div>
      </h1>
    </>
  );
}
