import type { Heading } from '@/types/heading';

const headingPattern = /^(#{2,5})[ \t]+(.+?)[ \t]*#*[ \t]*$/gm;

const stripInlineMarkdown = (value: string) =>
  value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim();

export const extractMarkdownHeadings = (content: string, idPrefix: string): Heading[] => {
  let index = 0;

  return Array.from(content.matchAll(headingPattern)).map((match) => {
    index += 1;

    return {
      id: `${idPrefix}-${index}`,
      title: stripInlineMarkdown(match[2]),
      level: match[1].length,
    };
  });
};
