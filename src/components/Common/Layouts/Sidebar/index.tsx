'use client';

import { Article } from '@/libs/Microcms';
import styles from './index.module.css';
import { useMutationObserver } from '@/hooks/Common/useMutationObserver';
import AdUnit from '../../../ThirdParties/GoogleAdSense/Elements/AdUnit';
import Profile from './Elements/Profile';
import Category from './Elements/Category';
import Tag from './Elements/Tag';
import Archive from './Elements/Archive';
import Popular from './Elements/Popular';
import Recent from './Elements/Recent';
import StickyContainer from './Elements/StickyContainer';

type Props = {
  recentArticles?: Article[];
  contentBlocks?: { rich_text?: string }[];
  article?: boolean;
};

export default function Sidebar({ recentArticles, contentBlocks, article = false }: Props) {
  useMutationObserver();

  return (
    <>
      <div className={`${article && styles.article} lg:col-span-1 lg:w-full lg:h-full mut-guard`}>
        <Profile />
        <AdUnit slot="8452341403" style={{ marginTop: '1.25rem' }} />
        <Category />
        <Tag />
        <AdUnit slot="9574685533" style={{ marginTop: '1.25rem' }} />
        <Archive />
        <Popular />
        {recentArticles && <Recent recentArticles={recentArticles} />}
        <StickyContainer contentBlocks={contentBlocks} />
      </div>
    </>
  );
}
