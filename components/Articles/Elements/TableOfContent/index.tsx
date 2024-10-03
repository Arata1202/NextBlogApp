import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = React.memo(({ headings }) => {
  const [activeId, setActiveId] = useState<string>('');
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

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentId = '';
      headings.forEach((heading, index) => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            currentId = heading.id;
          } else if (rect.top <= 150 && headings[index + 1]) {
            const nextElement = document.getElementById(headings[index + 1].id);
            if (nextElement && nextElement.getBoundingClientRect().top > 150) {
              currentId = heading.id;
            }
          }
        }
      });
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  return (
    <div>
      <div className="flex justify-center">
        <nav
          aria-label="Table of contents"
          className="tableOfContent w-1/2 border border-gray-300 p-4"
        >
          <h1 className="text-center font-bold text-lg">目次</h1>
          <ol className="mt-4 list-none pl-0">
            {formattedHeadings.map((heading) => (
              <li
                key={heading.id}
                style={{
                  marginLeft: heading.marginLeft,
                  backgroundColor: activeId === heading.id ? '#eaf4fc' : 'transparent',
                  transition: 'background-color 0.3s ease',
                }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className="hover:text-blue-500"
                >
                  {heading.number} {heading.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
});

TableOfContents.displayName = 'TableOfContents';

export default TableOfContents;
