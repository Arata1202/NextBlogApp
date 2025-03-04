import * as cheerio from 'cheerio';
import { Heading } from '@/types/heading';

export const useExtractHeadings = (contentBlocks: { rich_text?: string }[]): Heading[] => {
  const extractedHeadings: Heading[] = [];

  contentBlocks.forEach((block) => {
    if (block.rich_text) {
      const $ = cheerio.load(block.rich_text);
      const headingElements = $('h1, h2, h3, h4, h5');

      headingElements.each((_, element) => {
        const el = $(element);
        extractedHeadings.push({
          id: el.attr('id') || '',
          title: el.text() || '',
          level: parseInt(el.prop('tagName').slice(1), 10),
        });
      });
    }
  });

  return extractedHeadings;
};
