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

  return (
    <div className="lg:col-span-1 lg:w-full lg:h-full">
      <div className="sidebar">
        <Search />
        <Profile />
        <div className="FirstAd pc mt-5">
          <Display slot="8452341403" />
        </div>
        <Category />
        <Tag />
        <div className="FirstAd pc mt-5">
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
            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=realunivlog&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
          />
        </a>
      </div>
    </div>
  );
}
