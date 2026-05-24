'use client';

import { memo, useMemo, useRef } from 'react';
import { ContentBlock } from '@/types/microcms';
import styles from './index.module.css';
import { ARTICLE_CONTENT_AD_MARKER, formatRichText } from '@/utils/formatRichText';
import { useIframelyEmbeds } from '@/hooks/useIframelyEmbeds';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';

type Props = {
  block: ContentBlock;
  adSlots?: string[];
};

function RichText({ block, adSlots = [] }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldInsertAdsBeforeH2 = adSlots.length > 0;
  const html = useMemo(() => {
    return formatRichText(block.rich_text!, { insertAdsBeforeH2: shouldInsertAdsBeforeH2 });
  }, [block.rich_text, shouldInsertAdsBeforeH2]);
  const htmlParts = useMemo(() => html.split(ARTICLE_CONTENT_AD_MARKER), [html]);
  const dangerouslySetInnerHTML = useMemo(() => ({ __html: html }), [html]);

  useIframelyEmbeds(contentRef, html);

  if (shouldInsertAdsBeforeH2 && htmlParts.length > 1) {
    return (
      <div ref={contentRef}>
        {htmlParts.map((htmlPart, index) => (
          <div key={index}>
            {index > 0 && adSlots[index - 1] && <AdUnit slot={adSlots[index - 1]} />}
            {htmlPart && (
              <div className={styles.content} dangerouslySetInnerHTML={{ __html: htmlPart }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div
        ref={contentRef}
        className={styles.content}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    </>
  );
}

export default memo(RichText, (prevProps, nextProps) => {
  return (
    prevProps.block.rich_text === nextProps.block.rich_text &&
    (prevProps.adSlots ?? []).join(',') === (nextProps.adSlots ?? []).join(',')
  );
});
