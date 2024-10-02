'use client';

import React from 'react';
import { Listbox } from '@headlessui/react';
import SearchField from '../SearchField';
import Image from 'next/image';
import styles from './index.module.css';
import { UserProfile } from '@/section/Dummy';
import { SocialIcon, CategoryList, CategoryList2, PopularPost } from '@/section/Dummy';
import Display from '../Adsense/display';
import { Article } from '@/libs/microcms';
import SidebarArticleListItem from '../SidebarArticleListItem';
import TableOfContents from '../TableOfContent';
import { useEffect, useState } from 'react';
import { tags } from '@/section/Tag';
import { news } from '@/section/news';
import { archive } from '@/section/archive';
import { NewspaperIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import {
  MagnifyingGlassIcon,
  BellAlertIcon,
  FolderIcon,
  BoltIcon,
  HashtagIcon,
  UserCircleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';

type Props = {
  articles?: Article[];
  contentBlocks?: { rich_text2?: string }[];
};

interface ContentBlock {
  rich_text2?: string;
}

interface Heading {
  id: string;
  title: string;
  level: number;
}

function useExtractHeadings(contentBlocks: ContentBlock[]): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const extractedHeadings: Heading[] = [];

    contentBlocks.forEach((block) => {
      if (block.rich_text2) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = block.rich_text2;
        const blockHeadings = Array.from(tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
          (el) => ({
            id: el.id,
            title: el.textContent || '',
            level: parseInt(el.tagName[1], 10),
          }),
        );
        extractedHeadings.push(...blockHeadings);
      }
    });

    setHeadings(extractedHeadings);
  }, [contentBlocks]);

  return headings;
}

export default function Sidebar({ articles, contentBlocks = [] }: Props) {
  const headings = useExtractHeadings(contentBlocks);

  const sortedArticles = articles
    ?.slice()
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  const [selectedMonth, setSelectedMonth] = useState('');

  const handleArchiveChange = (value: string) => {
    if (value) {
      window.location.href = `/archive/${value}`;
      setSelectedMonth('');
    }
  };

  return (
    <div className="lg:col-span-1 lg:w-full lg:h-full">
      <div className="sidebar">
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
                        style={{ border: 'none' }}
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

        <div className="FirstAd pc mt-5">
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

      <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
        <h1 className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}>
          <CalendarDaysIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          アーカイブ
        </h1>

        <Listbox value={selectedMonth} onChange={handleArchiveChange}>
          <div className="relative mt-5">
            <Listbox.Button
              style={{ height: '40px' }}
              className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <span style={{ fontSize: '18px' }} className="block truncate">
                {selectedMonth
                  ? `${selectedMonth.split('/')[0]}年${selectedMonth
                      .split('/')[1]
                      .replace(/^0+/, '')}月`
                  : 'アーカイブを選択'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-7 w-7 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {archive.map((item, index) => (
                <Listbox.Option
                  key={index}
                  value={`${item.year}/${item.monthForPath}`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 ${
                      active ? 'bg-[#eaf4fc]' : 'text-gray-900'
                    }`
                  }
                >
                  <span
                    className={`block truncate font-normal ${
                      selectedMonth === `${item.year}/${item.monthForPath}` ? 'font-semibold' : ''
                    }`}
                  >
                    {`${item.year}年${item.month}月`}
                  </span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      <div className="SidebarTableOfContens mobile">
        {headings.length > 0 && <TableOfContents headings={headings} />}
      </div>
    </div>
  );
}
