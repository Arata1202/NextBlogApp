'use client';
import { useTheme } from 'next-themes';
import { HashtagIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { tags } from '@/section/tag';

export default function Tag() {
  const { theme } = useTheme();
  return (
    <div className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
      <h1 className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}>
        <HashtagIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        タグ
      </h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <a
            key={index}
            href={tag.link}
            className={`inline-block border rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 hover:text-blue-500 hover:border-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            {tag.name}
          </a>
        ))}
      </div>
    </div>
  );
}
