//最適化済み

import React, { useMemo } from 'react';

interface Heading {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = React.memo(({ headings }) => {
  const formattedHeadings = useMemo(() => {
    const headingNumbers: { [level: number]: number } = {};
    return headings.map((heading) => {
      if (!headingNumbers[heading.level]) {
        headingNumbers[heading.level] = 1;
      } else {
        headingNumbers[heading.level]++;
      }

      const headingNumber = Object.keys(headingNumbers)
        .filter((level) => parseInt(level) <= heading.level)
        .map((level) => headingNumbers[parseInt(level)])
        .join('.');

      for (let i = heading.level + 1; i <= 5; i++) {
        headingNumbers[i] = 0;
      }

      return {
        id: heading.id,
        title: heading.title,
        level: heading.level,
        number: headingNumber,
        marginLeft: `${(heading.level - 1) * 20}px`,
      };
    });
  }, [headings]);

  return (
    <div className="flex justify-center">
      <nav
        aria-label="Table of contents"
        className="tableOfContent w-1/2 border border-gray-300 p-4"
      >
        <h1 className="text-center font-bold text-lg">目次</h1>
        <ol className="mt-4 list-none pl-0">
          {formattedHeadings.map((heading) => (
            <li key={heading.id} style={{ marginLeft: heading.marginLeft }}>
              <a href={`#${heading.id}`} className="hover:text-blue-500">
                {heading.number} {heading.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
});

TableOfContents.displayName = 'TableOfContents';

export default TableOfContents;
