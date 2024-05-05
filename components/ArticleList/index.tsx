//最適化済み

'use client';

import React from 'react';
import { Article, Tag } from '@/libs/microcms';
import ArticleListItem from '../ArticleListItem';
import styles from './index.module.css';
import SearchField from '../SearchField';
import Image from 'next/image';
import TagList from '../TagList';
import Link from 'next/link';
import {
  HomeIcon,
  UserIcon,
  EnvelopeIcon,
  FolderIcon,
  FolderOpenIcon,
  BellAlertIcon,
} from '@heroicons/react/24/solid';
import { useMemo, useCallback } from 'react';
import Sidebar from '../Sidebar';

type Props = {
  articles?: Article[];
};

const ArticleList = ({ articles }: Props) => {
  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<Tag>();
    articles?.forEach((article) => {
      article.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [articles]);

  const showLatest = uniqueTags.length > 1;

  if (!articles || articles.length === 0) {
    return <p>記事がありません。</p>;
  }

  return (
    <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto mt-20">
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <h1 className="categoryTitle text-3xl font-bold pt-7">
            {showLatest ? (
              <div className="flex items-center">
                <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                <div>最新記事</div>
              </div>
            ) : (
              <div className="flex items-center">
                <FolderOpenIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                <TagList tags={uniqueTags} hasLink={false} />
              </div>
            )}
          </h1>
          <ul className={`${styles.main}`}>
            {articles.map((article) => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </ul>
        </div>

        <Sidebar />
      </div>
    </div>
  );
};
export default React.memo(ArticleList);
