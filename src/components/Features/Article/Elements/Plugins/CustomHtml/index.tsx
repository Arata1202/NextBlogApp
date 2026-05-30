'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ContentBlock } from '@/types/microcms';
import styles from './index.module.css';
import { runCustomHtmlScripts } from './scripts';
import { useIframelyEmbeds } from '@/hooks/useIframelyEmbeds';

type Props = {
  block: ContentBlock;
};

const SCRIPT_REPLAY_DELAY_MS = 100;
const SAFE_TARGET_BLANK_REL_VALUES = ['noopener', 'noreferrer'];

const shouldOpenInNewTab = (href: string) => {
  const trimmedHref = href.trim();
  const lowerHref = trimmedHref.toLowerCase();

  return (
    trimmedHref !== '' &&
    !trimmedHref.startsWith('#') &&
    !lowerHref.startsWith('javascript:') &&
    !lowerHref.startsWith('mailto:') &&
    !lowerHref.startsWith('tel:')
  );
};

const mergeRelValues = (currentRel: string | null) => {
  const values = new Set(currentRel?.split(/\s+/).filter(Boolean));

  SAFE_TARGET_BLANK_REL_VALUES.forEach((value) => values.add(value));

  return Array.from(values).join(' ');
};

const applyTargetBlankToLinks = (content: HTMLElement) => {
  content.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    const target = anchor.getAttribute('target');

    if (!href || !shouldOpenInNewTab(href) || target?.trim()) {
      return;
    }

    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', mergeRelValues(anchor.getAttribute('rel')));
  });
};

function CustomHtml({ block }: Props) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const html = block.custom_html!;
  const dangerouslySetInnerHTML = useMemo(() => ({ __html: html }), [html]);

  useIframelyEmbeds(contentRef, html);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    applyTargetBlankToLinks(content);

    const observer = new MutationObserver(() => {
      applyTargetBlankToLinks(content);
    });

    observer.observe(content, {
      attributeFilter: ['href', 'rel', 'target'],
      attributes: true,
      childList: true,
      subtree: true,
    });

    const timer = window.setTimeout(() => {
      runCustomHtmlScripts(content, html);
      applyTargetBlankToLinks(content);
    }, SCRIPT_REPLAY_DELAY_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [html, pathname]);

  return (
    <div
      ref={contentRef}
      className={styles.content}
      data-custom-html
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  );
}

export default memo(CustomHtml, (prevProps, nextProps) => {
  return prevProps.block.custom_html === nextProps.block.custom_html;
});
