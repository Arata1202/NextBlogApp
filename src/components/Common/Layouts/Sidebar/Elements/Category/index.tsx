'use client';

import Link from 'next/link';
import { useHydratedTheme } from '@/hooks/useHydratedTheme';
import { FolderIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { CATEGORY_ARR } from '@/constants/category';

export default function Category() {
  const { theme } = useHydratedTheme();

  return (
    <>
      <div
        className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <FolderIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          カテゴリー
        </div>
        <div className="grid grid-cols-2 gap-4 mt-5 md:mt-5">
          {CATEGORY_ARR.map((item) => (
            <Link
              key={item.name}
              href={`/category/${item.id}`}
              className={`${styles.CategoryList} text-start p-4 md:p-3 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              <div className="flex justify-center">
                <item.icon className="w-12 h-12" aria-hidden="true" />
              </div>
              <div className="flex justify-center mt-2">
                <div>{item.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
