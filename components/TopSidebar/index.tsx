'use client';

import React from 'react';
import { useState } from 'react';
import SearchField from '../SearchField';
import Image from 'next/image';
import styles from './index.module.css';
import { UserProfile } from '@/section/Dummy';
import { SocialIcon, CategoryList, CategoryList2, PopularPost } from '@/section/Dummy';
import { NewspaperIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import Display from '../Adsense/display';
import { news } from '@/section/news';
// import { OneSignalInitial } from '@/libs/OneSignalInitial';
import {
  MagnifyingGlassIcon,
  FolderIcon,
  BoltIcon,
  UserCircleIcon,
  HashtagIcon,
} from '@heroicons/react/24/solid';
import { tags } from '@/section/Tag';

export default function TopSidebar() {
  const [selectedMonth, setSelectedMonth] = useState('');

  const generateMonths = () => {
    const months = [];
    const current = new Date();
    const start = new Date(2023, 11);
    while (start <= current) {
      const year = start.getFullYear();
      const month = (start.getMonth() + 1).toString().padStart(2, '0');
      months.push({ year, month });
      start.setMonth(start.getMonth() + 1);
    }
    return months.reverse();
  };

  const handleArchiveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value) {
      window.location.href = `/archive/${value}`;
      setSelectedMonth('');
    }
  };
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
        {/* <OneSignalInitial /> */}
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
          <div className="mobile">
            {UserProfile.map((item) => (
              <Image
                key={item.imageUrl}
                className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
                src={item.imageUrl}
                alt={item.imageAlt}
                width={250}
                height={250}
                loading="eager"
              />
            ))}
          </div>
          <div className="pc">
            {UserProfile.map((item) => (
              <Image
                key={item.imageUrl}
                className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
                src={item.imageUrl}
                alt={item.imageAlt}
                width={250}
                height={250}
                loading="lazy"
              />
            ))}
          </div>
          {UserProfile.map((item) => (
            <h1
              key={item.profileTitle}
              className="mt-6 text-2xl text-center font-semibold leading-7 tracking-tight text-gray-800"
            >
              <a href={item.profileHref} className="hover:text-blue-500">
                {item.profileName}
              </a>
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
          <div className="text-lg leading-6 text-gray-800 mt-5 flex justify-center">
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
            <NewspaperIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            お知らせ
          </h1>

          <div className="">
            <div className="mt-5" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              <table className="min-w-full">
                <colgroup>
                  <col className="w-full sm:w-1/2" />
                </colgroup>
                <tbody>
                  {news.map((news, index) => (
                    <tr key={news.id} className="border-b border-gray-200">
                      <td
                        className={`max-w-0 ${
                          index === 0 ? 'pt-0 pb-5' : 'py-5'
                        } pl-4 pr-3 text-sm sm:pl-0`}
                      >
                        <div style={{ fontSize: '18px' }} className="text-gray-900">
                          {news.name}
                        </div>
                        <div className="mt-1 truncate">
                          <a
                            className="text-blue-500 hover:text-blue-700"
                            target="blank"
                            href={news.url}
                          >
                            {news.meta}
                          </a>
                        </div>
                        <div className="mt-1 truncate text-gray-500">{news.description}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* <Suzuri /> */}

        <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
          <h1
            className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}
          >
            <FolderIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            カテゴリー
          </h1>
          <nav className="flex gap-4 mt-5 md:mt-5" role="tablist">
            {CategoryList.map((item) => (
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
          <nav className="flex gap-4 mt-5 md:mt-5" role="tablist">
            {CategoryList2.map((item) => (
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

        <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
          <h1
            className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}
          >
            <HashtagIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            タグ
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <a
                key={index}
                href={tag.link}
                className="inline-block border border-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-900 mr-2 mb-2 hover:text-blue-500"
              >
                {tag.name}
              </a>
            ))}
          </div>
        </div>

        <div className="FirstAd mt-5">
          <Display slot="8452341403" />
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
        </div>

        <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
          <h1
            className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}
          >
            <CalendarDaysIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            アーカイブ
          </h1>

          <div>
            <select
              id="archive"
              name="archive"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                handleArchiveChange(e);
              }}
              className="mt-5 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              style={{ height: '40px', fontSize: '18px' }}
            >
              <option value="">アーカイブを選択</option>
              {generateMonths().map((item, index) => (
                <option key={index} value={`${item.year}/${item.month}`}>
                  {`${item.year}年${item.month}月`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
