'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Heading } from '@/types/heading';
import styles from './index.module.css';
import { formatHeadings } from '@/utils/formatHeadings';
import { colorClassNames, getThemeClassName } from '@/styles/designTokens';
import { useAppWebViewMode } from '@/hooks/useAppWebViewMode';

type Props = {
  headings: Heading[];
  sidebar?: boolean;
};

const WEB_HEADER_SCROLL_OFFSET = -130;
const APP_WEBVIEW_SCROLL_OFFSET = -10;

export default function TableOfContents({ headings, sidebar = false }: Props) {
  const { theme } = useTheme();
  const themeClassName = getThemeClassName(theme);
  const isAppWebViewMode = useAppWebViewMode();
  const [activeId, setActiveId] = useState('');

  const formattedHeadings = formatHeadings(headings);
  const scrollOffset = isAppWebViewMode ? APP_WEBVIEW_SCROLL_OFFSET : WEB_HEADER_SCROLL_OFFSET;
  const activeScrollPosition = Math.abs(scrollOffset) + 1;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + scrollOffset;
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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
            if (rect.top <= activeScrollPosition) {
              currentId = heading.id;
            }
          } else {
            if (rect.top <= activeScrollPosition && rect.bottom > activeScrollPosition) {
              currentId = heading.id;
            } else if (rect.top <= activeScrollPosition && headings[index + 1]) {
              const nextElement = document.getElementById(headings[index + 1].id);
              if (nextElement && nextElement.getBoundingClientRect().top > activeScrollPosition) {
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
  }, [activeScrollPosition, headings]);

  return (
    <nav className={`flex justify-center`} aria-label="目次">
      <div
        className={`${styles.toc} ${sidebar && styles.sidebarToc} w-1/2 border p-4 ${themeClassName}`}
      >
        <div className="text-center font-bold text-lg">目次</div>
        <ol className="mt-4 list-none pl-0">
          {formattedHeadings.map((heading) => (
            <li
              key={heading.id}
              style={{
                marginLeft: heading.marginLeft,
                backgroundColor:
                  activeId === heading.id ? 'var(--color-accent-soft-bg)' : 'transparent',
                color: activeId === heading.id ? 'var(--color-accent-soft-text)' : 'inherit',
                transition: 'background-color 0.3s ease',
              }}
            >
              <Link
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={colorClassNames.accentHoverText}
              >
                {heading.number} {heading.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
