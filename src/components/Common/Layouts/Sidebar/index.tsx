'use client';

import { useEffect, useState, useMemo } from 'react';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import { useGuardObserver } from '@/hooks/MutationObserver';
import AdUnit from '../../../ThirdParties/GoogleAdSense/Elements/AdUnit';
import TableOfContents from '../../TableOfContent';
import Profile from './Elements/Profile';
import Category from './Elements/Category';
import Tag from './Elements/Tag';
import Archive from './Elements/Archive';
import Popular from './Elements/Popular';
import Recent from './Elements/Recent';

type Props = {
  recentArticles?: Article[];
  contentBlocks?: { rich_text?: string }[];
  article?: boolean;
};

interface ContentBlock {
  rich_text?: string;
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
      if (block.rich_text) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = block.rich_text;
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

export default function Sidebar({ recentArticles, contentBlocks, article = false }: Props) {
  useGuardObserver();

  const memoizedContentBlocks = useMemo(() => contentBlocks || [], [contentBlocks]);
  const headings = useExtractHeadings(memoizedContentBlocks);

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
        {headings.length > 0 && (
          <div className={`${styles.pc} SidebarTableOfContents`}>
            <TableOfContents headings={headings} />
            <a href="https://www.buymeacoffee.com/realunivlog" target="_blank">
              <img
                className="mt-5 m-auto hover:opacity-60"
                loading="lazy"
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                width="160"
              />
            </a>
            <div className={`${styles.BuyMeaCoffee} text-center mt-4`}>
              もしこの記事が役に立ったなら、
              <br />
              こちらから ☕ を一杯支援いただけると喜びます
            </div>
          </div>
        )}
      </div>
    </>
  );
}
