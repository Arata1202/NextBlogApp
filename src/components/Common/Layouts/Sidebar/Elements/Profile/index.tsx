'use client';

import { useTheme } from 'next-themes';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { PROFILE_SENTENCE, PROFILE_NAME, PROFILE_IMAGE, SOCIAL_ICON } from '@/constants/data';
import { iconControlClassName } from '@/components/Common/controlClassNames';

export default function Profile() {
  const { theme } = useTheme();
  const themeClassName = theme === 'dark' ? 'DarkTheme' : 'LightTheme';

  return (
    <>
      <div className={`pt-8 px-4 border py-5 ${themeClassName}`}>
        <div className={`text-2xl text-center font-semibold pb-5 flex justify-center`}>
          <UserCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          ブログ運営者
        </div>
        {PROFILE_IMAGE.map((item) => (
          <img
            className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
            key={item.path}
            src={item.path}
            alt={item.alt}
            width={224}
            height={224}
          />
        ))}
        <div
          className={`mt-6 text-2xl text-center font-semibold leading-7 tracking-tight ${themeClassName}`}
        >
          {PROFILE_NAME}
        </div>
        <ul className="mt-6 flex justify-center gap-x-6">
          {SOCIAL_ICON.map((item) => (
            <li key={item.name}>
              <a
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconControlClassName} inline-flex h-10 w-10 items-center justify-center hover:text-blue-600`}
                aria-label={`${item.name}を新しいタブで開く`}
              >
                <item.icon className="h-8 w-8" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <div className={`text-lg leading-6 mt-5 flex justify-center ${themeClassName}`}>
          <ul className={styles.introductionSentence}>
            {PROFILE_SENTENCE.map((item) => (
              <li key={item.sentence}>{item.sentence}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
