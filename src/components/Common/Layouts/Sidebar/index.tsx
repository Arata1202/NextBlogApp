'use client';

import { Tag as TagType } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { UnifiedArticle } from '@/types/unified';
import styles from './index.module.css';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import AdUnit from '../../../ThirdParties/GoogleAdSense/Elements/AdUnit';
import Search from './Elements/Search';
import Profile from './Elements/Profile';
import Category from './Elements/Category';
import Tag from './Elements/Tag';
import Archive from './Elements/Archive';
import Recent from './Elements/Recent';
import StickyContainer from './Elements/StickyContainer';

type Props = {
  recentArticles?: UnifiedArticle[];
  currentArticleUrl?: string;
  contentBlocks?: { rich_text?: string }[];
  article?: boolean;
  tags: TagType[];
  archiveList: ArchiveItem[];
};

export default function Sidebar({
  recentArticles,
  currentArticleUrl,
  contentBlocks,
  article = false,
  tags,
  archiveList,
}: Props) {
  useMutationObserver();

  return (
    <>
      <aside
        className={`${article && styles.article} lg:col-span-1 lg:w-full lg:h-full mut-guard`}
        aria-label="サイドバー"
      >
        <Search />
        <Profile />
        <AdUnit slot="8452341403" style={{ marginTop: '1.25rem' }} />
        <Category />
        <Tag tags={tags} />
        <AdUnit slot="9574685533" style={{ marginTop: '1.25rem' }} />
        <Archive archiveList={archiveList} />
        {recentArticles && (
          <Recent recentArticles={recentArticles} currentArticleUrl={currentArticleUrl} />
        )}
        <StickyContainer contentBlocks={contentBlocks} />
      </aside>
    </>
  );
}
