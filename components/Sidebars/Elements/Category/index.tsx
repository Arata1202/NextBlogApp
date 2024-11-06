'use client';
import { useTheme } from 'next-themes';
import { FolderIcon } from '@heroicons/react/24/solid';
import { CategoryList, CategoryList2 } from '@/section/dummy';
import styles from './index.module.css';

export default function Category() {
  const { theme } = useTheme();
  return (
    <div className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
      <h1 className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}>
        <FolderIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        カテゴリー
      </h1>
      <nav className="flex gap-4 mt-5 md:mt-5" role="tablist">
        {CategoryList.map((item) => (
          <a
            href={item.href}
            className={`sidebarCategory text-start p-4 md:p-3 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            data-hs-tab="#tabs-with-card-1"
            role="tab"
            key={item.name}
          >
            <span className="flex">
              <span className="grow">
                <span
                  className={`block text-lg font-semibold ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  <ul>
                    <li>
                      <div className="flex justify-center">
                        <item.icon className="w-12 h-12" aria-hidden="true" />
                      </div>
                      <div className="flex justify-center mt-2">
                        <div>{item.name}</div>
                      </div>
                    </li>
                  </ul>
                </span>
              </span>
            </span>
          </a>
        ))}
      </nav>
      <nav className="flex gap-4 mt-5 md:mt-5" role="tablist">
        {CategoryList2.map((item) => (
          <a
            href={item.href}
            className={`sidebarCategory text-start p-4 md:p-3 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            data-hs-tab="#tabs-with-card-1"
            role="tab"
            key={item.name}
          >
            <span className="flex">
              <span className="grow">
                <span
                  className={`block text-lg font-semibold ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  <ul>
                    <li>
                      <div className="flex justify-center">
                        <item.icon className="w-12 h-12" aria-hidden="true" />
                      </div>
                      <div className="flex justify-center mt-2">
                        <div>{item.name}</div>
                      </div>
                    </li>
                  </ul>
                </span>
              </span>
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}
