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
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  );
}

export default memo(CustomHtml, (prevProps, nextProps) => {
  return prevProps.block.custom_html === nextProps.block.custom_html;
});
