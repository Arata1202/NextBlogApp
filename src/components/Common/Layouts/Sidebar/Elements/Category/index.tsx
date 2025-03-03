'use client';

import { useTheme } from 'next-themes';
import { FolderIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { CATEGORY_ARR } from '@/constants/category';

export default function Category() {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <FolderIcon className="h-8 w-8 mr-2" />
          カテゴリー
        </div>
        <div className="flex gap-4 mt-5 md:mt-5">
          {CATEGORY_ARR.slice(0, 2).map((item) => (
            <a
              key={item.name}
              href={`/category/${item.id}`}
              className={`${styles.CategoryList} text-start p-4 md:p-3 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              <div className="flex justify-center">
                <item.icon className="w-12 h-12" />
              </div>
              <div className="flex justify-center mt-2">
                <div>{item.name}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="flex gap-4 mt-5 md:mt-5">
          {CATEGORY_ARR.slice(2, 4).map((item) => (
            <a
              key={item.name}
              href={`/category/${item.id}`}
              className={`${styles.CategoryList} text-start p-4 md:p-3 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              <div className="flex justify-center">
                <item.icon className="w-12 h-12" />
              </div>
              <div className="flex justify-center mt-2">
                <div>{item.name}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
