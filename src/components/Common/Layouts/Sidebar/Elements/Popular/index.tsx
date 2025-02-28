'use client';

import { useTheme } from 'next-themes';
import { BoltIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { PopularPost } from '@/constants/Blog';

export default function Popular() {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <BoltIcon className="h-8 w-8 mr-2" />
          おすすめの投稿
        </div>
        {PopularPost.map((item, index) => (
          <ul
            key={item.postName}
            className={`border mt-5 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            <li>
              <a href={item.postHref} className={styles.link}>
                <img
                  key={index}
                  src={item.imageHref}
                  alt={item.imageAlt}
                  className={styles.image}
                />
                <div className={`${styles.title} font-bold`}>{item.postName}</div>
              </a>
            </li>
          </ul>
        ))}
      </div>
    </>
  );
}
