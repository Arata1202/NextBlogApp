'use client';

import { useRouter } from 'next/navigation';
import { useState, type KeyboardEvent } from 'react';
import { useTheme } from 'next-themes';
import { Listbox } from '@headlessui/react';
import { CalendarDaysIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { ArchiveItem } from '@/libs/archive';
import { fieldControlClassName } from '@/components/Common/controlClassNames';
import {
  colorClassNames,
  getThemeClassName,
  surfaceClassNames,
  transitionClassNames,
} from '@/styles/designTokens';

type Props = {
  archiveList: ArchiveItem[];
};

export default function Archive({ archiveList }: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const themeClassName = getThemeClassName(theme);

  const [selectedMonth, setSelectedMonth] = useState('');

  const handleArchiveChange = (value: string) => {
    setSelectedMonth(value);
    router.push(`/archive/${value}`);
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    event.currentTarget.click();
  };

  return (
    <>
      <div className={`pt-8 px-4 mt-5 ${surfaceClassNames.panel} ${themeClassName}`}>
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <CalendarDaysIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          アーカイブ
        </div>

        <Listbox value={selectedMonth} onChange={handleArchiveChange}>
          <div className="relative mt-5">
            <Listbox.Button
              type="button"
              onKeyDown={handleButtonKeyDown}
              className={`${fieldControlClassName} ${styles.ListBox} relative w-full cursor-pointer pl-3 pr-10 text-left text-base sm:text-sm ${themeClassName}`}
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
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Listbox.Options
              modal={false}
              className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto py-1 text-base sm:text-sm ${surfaceClassNames.popover} ${themeClassName}`}
            >
              {archiveList.map((item, index) => (
                <Listbox.Option
                  key={index}
                  value={`${item.year}/${item.month.padStart(2, '0')}`}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-9 ${transitionClassNames.color} ${colorClassNames.accentHoverText} ${active ? (theme === 'dark' ? 'text-blue-400!' : 'text-blue-600!') : ''} ${themeClassName}`
                  }
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
