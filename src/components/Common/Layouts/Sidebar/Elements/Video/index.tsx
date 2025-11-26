'use client';

import { useTheme } from 'next-themes';
import { YouTubeIcon } from '@/components/Common/Elements/SocialIcon';
import { YouTube } from '@/types/youtube';
import styles from './index.module.css';

type Props = {
  youtubeList: YouTube[];
};

export default function Video({ youtubeList }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <YouTubeIcon className="h-8 w-8 mr-2" />
          YouTube
        </div>
        {youtubeList.map((item) => (
          <ul
            key={item.id}
            className={`border mt-5 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            <li>
              <a href={item.url} target="_blank" className={styles.link}>
                <img src={item.thumbnailUrl} alt={item.title} className={styles.image} />
                <div className={`${styles.title} font-bold`}>{item.title}</div>
              </a>
            </li>
          </ul>
        ))}
      </div>
    </>
  );
}
