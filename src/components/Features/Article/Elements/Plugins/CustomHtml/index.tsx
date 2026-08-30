'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './index.module.css';
import { applySponsoredRelToLinks, applyTargetBlankToLinks } from './links';
import { setupMoshimoEasyLinkFallback, syncMoshimoEasyLinkArrows } from './moshimoEasyLinkFallback';
import { runCustomHtmlScripts } from './scripts';
import { useIframelyEmbeds } from '@/hooks/useIframelyEmbeds';
import { useInstagramEmbeds } from '@/hooks/useInstagramEmbeds';
import { useCodeBlockCopyButtons } from '@/hooks/useCodeBlockCopyButtons';

type Props = {
  html: string;
  sponsorUrl?: string;
};

const SCRIPT_REPLAY_DELAY_MS = 100;

function CustomHtml({ html, sponsorUrl }: Props) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const dangerouslySetInnerHTML = useMemo(() => ({ __html: html }), [html]);

  useIframelyEmbeds(contentRef, html);
  useInstagramEmbeds(contentRef, html);
  useCodeBlockCopyButtons(contentRef, html);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const syncCustomHtmlEnhancements = () => {
      applyTargetBlankToLinks(content);
      applySponsoredRelToLinks(content, sponsorUrl);
      syncMoshimoEasyLinkArrows(content);
    };

    syncCustomHtmlEnhancements();

    const cleanupMoshimoEasyLinkFallback = setupMoshimoEasyLinkFallback(content);

    let iframeFocusFrame: number | undefined;
    const clearIframeFocus = () => {
      content.querySelectorAll('iframe[data-focus-visible]').forEach((iframe) => {
        iframe.removeAttribute('data-focus-visible');
      });
    };
    const syncIframeFocus = () => {
      window.cancelAnimationFrame(iframeFocusFrame ?? 0);
      iframeFocusFrame = window.requestAnimationFrame(() => {
        clearIframeFocus();
        const activeElement = document.activeElement;

        if (activeElement instanceof HTMLIFrameElement && content.contains(activeElement)) {
          activeElement.dataset.focusVisible = 'true';
        }
      });
    };

    window.addEventListener('blur', syncIframeFocus);
    window.addEventListener('focus', clearIframeFocus);

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
      window.cancelAnimationFrame(iframeFocusFrame ?? 0);
      window.removeEventListener('blur', syncIframeFocus);
      window.removeEventListener('focus', clearIframeFocus);
      clearIframeFocus();
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [html, pathname, sponsorUrl]);

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
  return prevProps.html === nextProps.html && prevProps.sponsorUrl === nextProps.sponsorUrl;
});
