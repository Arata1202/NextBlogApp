import { useEffect, useState, useMemo } from 'react';
import styles from './index.module.css';
import TableOfContents from '@/components/Common/TableOfContent';
import BuyMeaCoffee from '@/components/Common/Share/Elements/Elements/BuyMeaCoffee';

interface ContentBlock {
  rich_text?: string;
}

interface Heading {
  id: string;
  title: string;
  level: number;
}

type Props = {
  contentBlocks?: { rich_text?: string }[];
};

function useExtractHeadings(contentBlocks: ContentBlock[]): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const extractedHeadings: Heading[] = [];

    contentBlocks.forEach((block) => {
      if (block.rich_text) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = block.rich_text;
        const blockHeadings = Array.from(tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
          (el) => ({
            id: el.id,
            title: el.textContent || '',
            level: parseInt(el.tagName[1], 10),
          }),
        );
        extractedHeadings.push(...blockHeadings);
      }
    });

    setHeadings(extractedHeadings);
  }, [contentBlocks]);

  return headings;
}

export default function StickyContainer({ contentBlocks }: Props) {
  const memoizedContentBlocks = useMemo(() => contentBlocks || [], [contentBlocks]);
  const headings = useExtractHeadings(memoizedContentBlocks);
  return (
    <>
      {headings.length > 0 && (
        <div className={`${styles.pc} SidebarTableOfContents`}>
          <TableOfContents headings={headings} />
          <BuyMeaCoffee sidebar={true} />
        </div>
      )}
    </>
  );
}
