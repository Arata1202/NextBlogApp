'use client';

import { memo, useMemo, useRef } from 'react';
import { ContentBlock } from '@/types/microcms';
import styles from './index.module.css';
import { formatRichText } from '@/utils/formatRichText';
import { useIframelyEmbeds } from '@/hooks/useIframelyEmbeds';

type Props = {
  block: ContentBlock;
};

function RichText({ block }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const html = useMemo(() => {
    return formatRichText(block.rich_text!);
  }, [block.rich_text]);
  const dangerouslySetInnerHTML = useMemo(() => ({ __html: html }), [html]);

  useIframelyEmbeds(contentRef, html);

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
  return prevProps.block.rich_text === nextProps.block.rich_text;
});
