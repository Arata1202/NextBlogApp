'use client';

import React from 'react';

interface Heading {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const headingNumbers: { [level: number]: number } = {};
  return (
    <div className="flex justify-center">
      <nav
        aria-label="Table of contents"
        className="tableOfContent w-1/2 border border-gray-300 p-4"
      >
        <h1 className="text-center font-bold text-lg">目次</h1>
        <ol style={{ listStyleType: 'none', paddingLeft: 0 }} className="mt-4">
          {headings.map((heading, index) => {
            // 見出しの番号をインクリメント
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

            return (
              <li key={index} style={{ marginLeft: `${(heading.level - 1) * 20}px` }}>
                <a href={`#${heading.id}`} className="hover:text-blue-500">
                  {`${headingNumber}`}&nbsp;&nbsp; {`${heading.title}`}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default TableOfContents;
