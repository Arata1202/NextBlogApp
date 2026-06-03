'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './index.module.css';
import { applyTargetBlankToLinks } from './links';
import { setupMoshimoEasyLinkFallback, syncMoshimoEasyLinkArrows } from './moshimoEasyLinkFallback';
import { runCustomHtmlScripts } from './scripts';
import { useIframelyEmbeds } from '@/hooks/useIframelyEmbeds';
import { useCodeBlockCopyButtons } from '@/hooks/useCodeBlockCopyButtons';

type Props = {
  html: string;
};

const SCRIPT_REPLAY_DELAY_MS = 100;

function CustomHtml({ html }: Props) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const dangerouslySetInnerHTML = useMemo(() => ({ __html: html }), [html]);

  useIframelyEmbeds(contentRef, html);
  useCodeBlockCopyButtons(contentRef, html);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const syncCustomHtmlEnhancements = () => {
      applyTargetBlankToLinks(content);
      syncMoshimoEasyLinkArrows(content);
    };

    syncCustomHtmlEnhancements();

    const cleanupMoshimoEasyLinkFallback = setupMoshimoEasyLinkFallback(content);

    const observer = new MutationObserver(() => {
      syncCustomHtmlEnhancements();
    });

    observer.observe(content, {
      attributeFilter: ['class', 'href', 'rel', 'target'],
      attributes: true,
      childList: true,
      subtree: true,
    });

    const timer = window.setTimeout(() => {
      runCustomHtmlScripts(content, html);
      syncCustomHtmlEnhancements();
    }, SCRIPT_REPLAY_DELAY_MS);

    return () => {
      cleanupMoshimoEasyLinkFallback();
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
  return prevProps.html === nextProps.html;
});
