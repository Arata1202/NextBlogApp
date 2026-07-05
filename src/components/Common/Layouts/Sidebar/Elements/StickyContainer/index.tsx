import { useEffect, useMemo, useRef } from 'react';
import styles from './index.module.css';
import TableOfContents from '@/components/Common/TableOfContent';
import BuyMeaCoffee from '@/components/Common/Share/Elements/Elements/BuyMeaCoffee';
import { useExtractHeadings } from '@/hooks/useExtractHeadings';

const STICKY_STOP_SELECTOR = '[data-sidebar-sticky-stop], [data-apps-promo]';
const STICKY_TOP = 90;
const STICKY_APPS_PROMO_GAP = 16;

type Props = {
  contentBlocks?: { rich_text?: string }[];
};

export default function StickyContainer({ contentBlocks }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const memoizedContentBlocks = useMemo(() => contentBlocks || [], [contentBlocks]);
  const headings = useExtractHeadings(memoizedContentBlocks);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    let animationFrameId = 0;

    const resetPanel = () => {
      const frame = frameRef.current;
      const panel = panelRef.current;

      if (!frame || !panel) {
        return;
      }

      frame.style.height = '';
      panel.style.position = '';
      panel.style.top = '';
      panel.style.left = '';
      panel.style.width = '';
      panel.style.zIndex = '';
    };

    const fixPanel = (frame: HTMLDivElement, panel: HTMLDivElement, panelHeight: number) => {
      const frameRect = frame.getBoundingClientRect();

      frame.style.height = `${panelHeight}px`;
      panel.style.position = 'fixed';
      panel.style.top = `${STICKY_TOP}px`;
      panel.style.left = `${frameRect.left}px`;
      panel.style.width = `${frameRect.width}px`;
      panel.style.zIndex = '20';
    };

    const stopPanel = (
      frame: HTMLDivElement,
      panel: HTMLDivElement,
      panelHeight: number,
      top: number,
    ) => {
      frame.style.height = `${panelHeight}px`;
      panel.style.position = 'absolute';
      panel.style.top = `${top}px`;
      panel.style.left = '0';
      panel.style.width = '100%';
      panel.style.zIndex = '';
    };

    const updatePanel = () => {
      animationFrameId = 0;

      const frame = frameRef.current;
      const panel = panelRef.current;
      const stickyStopElement = document.querySelector<HTMLElement>(STICKY_STOP_SELECTOR);

      if (!frame || !panel || !stickyStopElement) {
        resetPanel();
        return;
      }

      const frameRect = frame.getBoundingClientRect();
      const stickyStopRect = stickyStopElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const panelHeight = panel.offsetHeight;
      const frameDocumentTop = scrollY + frameRect.top;
      const stickyDocumentTop = scrollY + STICKY_TOP;
      const stopDocumentTop = scrollY + stickyStopRect.top - STICKY_APPS_PROMO_GAP - panelHeight;

      if (stickyDocumentTop < frameDocumentTop) {
        resetPanel();
        return;
      }

      if (stickyDocumentTop >= stopDocumentTop) {
        stopPanel(frame, panel, panelHeight, Math.max(0, stopDocumentTop - frameDocumentTop));
        return;
      }

      fixPanel(frame, panel, panelHeight);
    };

    const scheduleUpdate = () => {
      if (animationFrameId !== 0) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updatePanel);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }

      resetPanel();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [headings.length]);

  return (
    <>
      {headings.length > 0 && (
        <div className={`${styles.pc} ${styles.stickyFrame}`} ref={frameRef}>
          <div className={styles.stickyPanel} ref={panelRef}>
            <TableOfContents headings={headings} sidebar={true} />
            <BuyMeaCoffee sidebar={true} />
          </div>
        </div>
      )}
    </>
  );
}
