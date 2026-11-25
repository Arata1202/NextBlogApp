'use client';

import { SiteLink as Link } from '@/components/Common/AppWebViewLinkHandler';
import { useResolvedTheme } from '@/components/Common/useResolvedTheme';
import { useEffect, useState } from 'react';
import { Heading } from '@/types/heading';
import styles from './index.module.css';
import { formatHeadings } from '@/utils/formatHeadings';
import { colorClassNames, getThemeClassName } from '@/styles/uiClassNames';
import { useAppWebViewMode } from '@/hooks/useAppWebViewMode';

type Props = {
  headings: Heading[];
  sidebar?: boolean;
};

const WEB_HEADER_SCROLL_OFFSET = -100;
const APP_WEBVIEW_SCROLL_OFFSET = -16;

export default function TableOfContents({ headings, sidebar = false }: Props) {
  const theme = useResolvedTheme();
  const themeClassName = getThemeClassName(theme);
  const isAppWebViewMode = useAppWebViewMode();
  const [activeId, setActiveId] = useState('');

  const formattedHeadings = formatHeadings(headings);
  const scrollOffset = isAppWebViewMode ? APP_WEBVIEW_SCROLL_OFFSET : WEB_HEADER_SCROLL_OFFSET;
  const activeScrollPosition = Math.abs(scrollOffset) + 1;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    const element = document.getElementById(id);
    if (element) {
      event.preventDefault();
      if (window.location.hash !== event.currentTarget.hash) {
        window.history.pushState(window.history.state, '', event.currentTarget.hash);
      }
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
      const atBottom =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && (atBottom || element.getBoundingClientRect().top <= activeScrollPosition))
          currentId = heading.id;
      }
      setActiveId(currentId);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeScrollPosition, headings]);

  return (
    <nav className={`flex justify-center`} aria-label="目次">
      <div
        className={`${styles.toc} ${sidebar ? styles.sidebarToc : ''} w-1/2 border p-4 ${themeClassName}`}
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
