import { Listbox } from '@headlessui/react';
import { CalendarDaysIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { archive } from '@/section/archive';
import { useState } from 'react';
import styles from './index.module.css';

interface Props {
  isDarkMode?: boolean;
}

export default function Archive({ isDarkMode }: Props) {
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleArchiveChange = (value: string) => {
    if (value) {
      window.location.href = `/archive/${value}`;
      setSelectedMonth('');
    }
  };
  return (
    <div
      className={`pt-8 px-4 border py-5 mt-5 ${isDarkMode ? 'DarkTheme border-gray-500' : 'lightTheme border-gray-300'}`}
    >
      <h1 className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}>
        <CalendarDaysIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        アーカイブ
      </h1>

      <Listbox value={selectedMonth} onChange={handleArchiveChange}>
        <div className="relative mt-5">
          <Listbox.Button
            style={{ height: '40px' }}
            className={`relative w-full cursor-default rounded-md py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500 sm:text-sm sm:leading-6 ${isDarkMode ? 'DarkTheme ring-gray-500' : 'lightTheme ring-gray-300'}`}
          >
            <span style={{ fontSize: '18px' }} className="block truncate">
              {selectedMonth
                ? `${selectedMonth.split('/')[0]}年${selectedMonth
                    .split('/')[1]
                    .replace(/^0+/, '')}月`
                : 'アーカイブを選択'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-7 w-7 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 focus:outline-none sm:text-sm  ${isDarkMode ? 'DarkTheme ring-gray-500' : 'lightTheme ring-gray-300'}`}
          >
            {archive.map((item, index) => (
              <Listbox.Option
                key={index}
                value={`${item.year}/${item.monthForPath}`}
                className={() =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 hover:text-blue-500  ${isDarkMode ? 'DarkTheme' : 'lightTheme'}`
                }
              >
                <span
                  className={`block truncate font-normal ${
                    selectedMonth === `${item.year}/${item.monthForPath}` ? 'font-semibold' : ''
                  }`}
                >
                  {`${item.year}年${item.month}月`}
                </span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
