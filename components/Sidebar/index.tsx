'use client';

import React from 'react';
import SearchField from '../SearchField';
import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.css';
import { UserProfile } from '@/Section/Dummy';
import { SocialIcon, CategoryList, PopularPost } from '@/Section/Dummy';
import { Article } from '@/libs/microcms';
import SidebarArticleListItem from '../SidebarArticleListItem';
import {
  MagnifyingGlassIcon,
  BellAlertIcon,
  FolderIcon,
  BoltIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';

type Props = {
  articles?: Article[];
};

export default function Sidebar({ articles }: Props) {
  const sortedArticles = articles
    ?.slice()
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="lg:col-span-1 lg:w-full lg:h-full">
      <div className="sidebar sticky top-0 start-0">
        <div className="bg-white pt-8 px-4 border border-gray-300 py-5">
          <h1
            className={`${styles.profile} text-2xl text-center font-semibold mb-5 flex justify-center`}
          >
            <MagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            キーワードで探す
          </h1>
          <SearchField />
        </div>
        {/* Profile Media */}
        <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
          {UserProfile.map((item) => (
            <h1
              key={item.profileTitle}
              className={`${styles.profile} text-2xl text-center font-semibold pb-5 flex justify-center`}
            >
              <UserCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              {item.profileTitle}
            </h1>
          ))}
          {UserProfile.map((item) => (
            <Image
              key={item.imageUrl}
              className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
              src={item.imageUrl}
              alt={item.imageAlt}
              width={250}
              height={250}
              priority
            />
          ))}
          {UserProfile.map((item) => (
            <h1
              key={item.profileTitle}
              className="mt-6 text-2xl text-center font-semibold leading-7 tracking-tight text-gray-800"
            >
              <Link href={item.profileHref} className="hover:text-blue-500">
                {item.profileName}
              </Link>
            </h1>
          ))}
          <ul role="list" className="mt-6 flex justify-center gap-x-6">
            {SocialIcon.map((icon, index) => (
              <li key={index}>
                <a target="blank" href={icon.href} className="text-gray-400 hover:text-blue-500">
                  <span className="sr-only">{icon.name}</span>
                  <icon.icon className="h-8 w-8" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <div className="text-lg leading-6 text-gray-800 mt-5">
            <div>
              {UserProfile.map((item, index) => (
                <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {item.profileIntroduction.map((intro, introIndex) => (
                    <li key={introIndex}>{intro.sentence}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
          <h1
            className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}
          >
            <FolderIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            カテゴリー
          </h1>
          <nav className="flex gap-4 mt-5 md:mt-5" role="tablist">
            {CategoryList.map((item, index) => (
              <a
                href={item.href}
                className="sidebarCategory hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start p-4 md:p-3 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
                data-hs-tab="#tabs-with-card-1"
                role="tab"
                key={item.name}
              >
                <span className="flex">
                  <span className="grow">
                    <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800">
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

        <div className="sidebarArticleList">
          <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
            <h1
              className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}
            >
              <BoltIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              人気の投稿
            </h1>
            {PopularPost.map((item, index) => (
              <ol
                key={item.postName}
                className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
              >
                <li>
                  <Link className="" href={item.postHref}>
                    <Image
                      src={item.imageHref}
                      alt={item.imageAlt}
                      className="ArticleListItem_image"
                      width="800"
                      height="450"
                      key={index}
                    />
                    <div>
                      <div className="ArticleListItem_title font-bold">{item.postName}</div>
                    </div>
                  </Link>
                </li>
              </ol>
            ))}
          </div>
          <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
            <h1
              className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}
            >
              <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              最新の投稿
            </h1>
            {sortedArticles && sortedArticles.length > 0 ? (
              <div>
                {sortedArticles.map((article) => (
                  <SidebarArticleListItem key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <p className="text-center">新着記事はありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
