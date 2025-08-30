'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Heading } from '@/types/heading';
import styles from './index.module.css';
import { formatHeadings } from '@/utils/formatHeadings';

type Props = {
  headings: Heading[];
  sidebar?: boolean;
};

export default function TableOfContents({ headings, sidebar = false }: Props) {
  const { theme } = useTheme();
  const [activeId, setActiveId] = useState('');

  const formattedHeadings = formatHeadings(headings);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentId = '';
      headings.forEach((heading, index) => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isLastHeading = index === headings.length - 1;
          if (isLastHeading) {
            if (rect.top <= 131) {
              currentId = heading.id;
            }
          } else {
            if (rect.top <= 131 && rect.bottom > 131) {
              currentId = heading.id;
            } else if (rect.top <= 131 && headings[index + 1]) {
              const nextElement = document.getElementById(headings[index + 1].id);
              if (nextElement && nextElement.getBoundingClientRect().top > 131) {
                currentId = heading.id;
              }
            }
          }
        }
      });
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <div className={`flex justify-center`}>
      <div
        className={`${styles.toc} ${sidebar && styles.sidebarToc} w-1/2 border p-4 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className="text-center font-bold text-lg">目次</div>
        <ol className="mt-4 list-none pl-0">
          {formattedHeadings.map((heading) => (
            <li
              key={heading.id}
              style={{
                marginLeft: heading.marginLeft,
                backgroundColor: activeId === heading.id ? '#eaf4fc' : 'transparent',
                color: activeId === heading.id && theme === 'dark' ? 'black' : 'inherit',
                transition: 'background-color 0.3s ease',
              }}
            >
              <Link
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className="hover:text-blue-500"
              >
                {heading.number} {heading.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
