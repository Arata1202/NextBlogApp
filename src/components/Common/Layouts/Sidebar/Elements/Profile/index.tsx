'use client';

import { useTheme } from 'next-themes';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { PROFILE_SENTENCE, PROFILE_NAME, PROFILE_IMAGE, SOCIAL_ICON } from '@/constants/data';

export default function Profile() {
  const { theme } = useTheme();

  return (
    <>
      <div className={`pt-8 px-4 border py-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
        <div className={`text-2xl text-center font-semibold pb-5 flex justify-center`}>
          <UserCircleIcon className="h-8 w-8 mr-2" />
          ブログ運営者
        </div>
        {PROFILE_IMAGE.map((item) => (
          <img
            className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
            key={item.path}
            src={item.path}
            alt={item.alt}
          />
        ))}
        <div
          className={`mt-6 text-2xl text-center font-semibold leading-7 tracking-tight ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
        >
          {PROFILE_NAME}
        </div>
        <ul className="mt-6 flex justify-center gap-x-6">
          {SOCIAL_ICON.map((item) => (
            <li key={item.name}>
              <a
                target="blank"
                href={item.path}
                className={`hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                <item.icon className="h-8 w-8" />
              </a>
            </li>
          ))}
        </ul>
        <div
          className={`text-lg leading-6 mt-5 flex justify-center ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
        >
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
