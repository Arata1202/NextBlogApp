'use client';

import React from 'react';
import Search from '../Elements/Search';
import Profile from '../Elements/Profile';
import Category from '../Elements/Category';
import News from '../Elements/News';
import Tag from '../Elements/Tag';
import Archive from '../Elements/Archive';
import Popular from '../Elements/Popular';
import Recent from '../Elements/Recent';
import Display from '../../Adsense/Display';
import { Article } from '@/libs/microcms';
import TableOfContents from '../../Articles/TableOfContent';
import { useEffect, useState } from 'react';

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

  return (
    <div className="lg:col-span-1 lg:w-full lg:h-full">
      <div className="sidebar">
        <Search />
        <Profile />
        <News />
        <Category />
        <Tag />
        <div className="FirstAd pc mt-5">
          <Display slot="8452341403" />
        </div>
        <Archive />
        <Popular />
        <Recent articles={articles} />
      </div>
      <div className="SidebarTableOfContens mobile">
        {headings.length > 0 && <TableOfContents headings={headings} />}
      </div>
    </div>
  );
}
