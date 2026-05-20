'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ContentBlock } from '@/types/microcms';
import styles from './index.module.css';
import { runCustomHtmlScripts } from './scripts';

type Props = {
  block: ContentBlock;
};

const SCRIPT_REPLAY_DELAY_MS = 100;

export default function CustomHtml({ block }: Props) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const html = block.custom_html!;

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const timer = window.setTimeout(() => {
      runCustomHtmlScripts(content, html);
    }, SCRIPT_REPLAY_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [html, pathname]);

  return (
    <div
      ref={contentRef}
      className={styles.content}
      data-custom-html
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
