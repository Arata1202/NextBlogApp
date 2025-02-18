'use client';

import { useTheme } from 'next-themes';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import { UserProfile, SocialIcon } from '@/section/dummy';

export default function Profile() {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className={`text-2xl text-center font-semibold pb-5 flex justify-center`}>
          <UserCircleIcon className="h-8 w-8 mr-2" />
          ブログ運営者
        </div>
        <img
          className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
          src="/images/blog/face.webp"
          alt="筆者のイメージ"
        />
        <div
          className={`mt-6 text-2xl text-center font-semibold leading-7 tracking-tight ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
        >
          あらた
        </div>
        <ul className="mt-6 flex justify-center gap-x-6">
          {SocialIcon.map((icon, index) => (
            <li key={index}>
              <a
                target="blank"
                href={icon.href}
                className={`hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                <icon.icon className="h-8 w-8" />
              </a>
            </li>
          ))}
        </ul>
        <div
          className={`text-lg leading-6 mt-5 flex justify-center ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
        >
          {UserProfile.map((item, index) => (
            <ul key={index} className={styles.introductionSentence}>
              {item.profileIntroduction.map((intro, introIndex) => (
                <li key={introIndex}>{intro.sentence}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}
