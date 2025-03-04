import { useMemo } from 'react';
import styles from './index.module.css';
import TableOfContents from '@/components/Common/TableOfContent';
import BuyMeaCoffee from '@/components/Common/Share/Elements/Elements/BuyMeaCoffee';
import { useExtractHeadings } from '@/hooks/useExtractHeadings';

type Props = {
  contentBlocks?: { rich_text?: string }[];
};

export default function StickyContainer({ contentBlocks }: Props) {
  const memoizedContentBlocks = useMemo(() => contentBlocks || [], [contentBlocks]);
  const headings = useExtractHeadings(memoizedContentBlocks);
  return (
    <>
      {headings.length > 0 && (
        <div className={`${styles.pc} ${styles.sidebar}`}>
          <TableOfContents headings={headings} sidebar={true} />
          <BuyMeaCoffee sidebar={true} />
        </div>
      )}
    </>
  );
}
