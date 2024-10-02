import { Listbox } from '@headlessui/react';
import { CalendarDaysIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { archive } from '@/section/archive';
import { useState } from 'react';
import styles from '../../FixedSidebar/index.module.css';

export default function Archive() {
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleArchiveChange = (value: string) => {
    if (value) {
      window.location.href = `/archive/${value}`;
      setSelectedMonth('');
    }
  };
  return (
    <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
      <h1 className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}>
        <CalendarDaysIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        アーカイブ
      </h1>

      <Listbox value={selectedMonth} onChange={handleArchiveChange}>
        <div className="relative mt-5">
          <Listbox.Button
            style={{ height: '40px' }}
            className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {archive.map((item, index) => (
              <Listbox.Option
                key={index}
                value={`${item.year}/${item.monthForPath}`}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 ${
                    active ? 'bg-[#eaf4fc]' : 'text-gray-900'
                  }`
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
