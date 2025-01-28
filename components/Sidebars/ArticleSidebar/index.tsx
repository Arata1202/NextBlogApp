'use client';

import React from 'react';
import Search from '../Elements/Search';
import Profile from '../Elements/Profile';
import Category from '../Elements/Category';
import Tag from '../Elements/Tag';
import Archive from '../Elements/Archive';
import Popular from '../Elements/Popular';
import Recent from '../Elements/Recent';
import Display from '../../Adsense/Display';
import { Article } from '@/libs/microcms';
import TableOfContents from '../../Articles/Elements/TableOfContent';
import { useEffect, useState } from 'react';
import { useGuardObserver } from '@/hooks/MutationObserver';

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

export default function ArticleSidebar({ articles, contentBlocks = [] }: Props) {
  const headings = useExtractHeadings(contentBlocks);
  useGuardObserver();

  return (
    <div className="lg:col-span-1 lg:w-full lg:h-full mut-guard">
      <div className="sidebar">
        <Search />
        <Profile />
        <div className="FirstAd mt-5 mut-guard">
          <Display slot="8452341403" />
        </div>
        <Category />
        <Tag />
        <div className="FirstAd mt-5 mut-guard">
          <Display slot="9574685533" />
        </div>
        <Archive />
        <Popular />
        <Recent articles={articles} />
      </div>
      <div className="SidebarTableOfContens mobile">
        {headings.length > 0 && <TableOfContents headings={headings} />}
        <a href="https://www.buymeacoffee.com/realunivlog" target="_blank">
          <img
            className="mt-5 m-auto hover:opacity-60"
            loading="lazy"
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            width="160"
          />
        </a>
        <div className="text-center mt-4" style={{ fontSize: '12px' }}>
          もしこの記事が役に立ったなら、
          <br />
          こちらから ☕ を一杯支援いただけると喜びます
        </div>
      </div>
    </div>
  );
}
