'use client';
import { useTheme } from 'next-themes';
import React from 'react';
import Image from 'next/image';
import styles from './index.module.css';
import { BoltIcon } from '@heroicons/react/24/solid';
import { PopularPost } from '@/section/dummy';

export default function Popular() {
  const { theme } = useTheme();
  return (
    <div className={`pt-8 px-4 border py-5 mt-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
      <h1 className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}>
        <BoltIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        おすすめの投稿
      </h1>
      {PopularPost.map((item, index) => (
        <ol
          key={item.postName}
          className={`ArticleListItem_list border mt-5 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
        >
          <li>
            <a
              href={item.postHref}
              className="sidebarPopularPost"
              onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                window.location.href = item.postHref;
              }}
            >
              <Image
                src={item.imageHref}
                alt={item.imageAlt}
                className="ArticleListItem_image"
                width="600"
                height="300"
                key={index}
              />
              <div>
                <div className="ArticleListItem_title font-bold">{item.postName}</div>
              </div>
            </a>
          </li>
        </ol>
      ))}
    </div>
  );
}
