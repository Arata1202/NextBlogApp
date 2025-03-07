'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Listbox } from '@headlessui/react';
import { CalendarDaysIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { ARCHIVE_ARR } from '@/constants/archive';

export default function Archive() {
  const { theme } = useTheme();
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState('');

  const handleArchiveChange = (value: string) => {
    setSelectedMonth(value);
    router.push(`/archive/${value}`);
  };

  return (
    <>
      <div
        className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <CalendarDaysIcon className="h-8 w-8 mr-2" />
          アーカイブ
        </div>

        <Listbox value={selectedMonth} onChange={handleArchiveChange}>
          <div className="relative mt-5">
            <Listbox.Button
              className={`${styles.ListBox} relative w-full cursor-pointer rounded-md py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              <span className={`${styles.ListBoxSelect} block truncate text-gray-500`}>
                {selectedMonth
                  ? `${selectedMonth.split('/')[0]}年${selectedMonth
                      .split('/')[1]
                      .replace(/^0+/, '')}月`
                  : 'アーカイブを選択'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className={`h-7 w-7 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-300'}`}
                />
              </span>
            </Listbox.Button>

            <Listbox.Options
              className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-opacity-5 focus:outline-none sm:text-sm ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              {ARCHIVE_ARR.map((item, index) => (
                <Listbox.Option
                  key={index}
                  value={`${item.year}/${item.month.padStart(2, '0')}`}
                  className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  {`${item.year}年${item.month}月`}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
    </>
  );
}
