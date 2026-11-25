import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';
import type { Heading } from '@/types/heading';

const parser = unified().use(remarkParse).use(remarkGfm);

export function extractMarkdownHeadings(content: string, idPrefix: string): Heading[] {
  const root = parser.parse(content);
  const headings: Heading[] = [];
  function visit(node: typeof root | (typeof root.children)[number]) {
    if (node.type === 'heading' && node.depth >= 2 && node.depth <= 5) {
      headings.push({
        id: `${idPrefix}-${headings.length + 1}`,
        title: toString(node),
        level: node.depth,
      });
    }
    if ('children' in node) node.children.forEach(visit);
  }
  visit(root);
  return headings;
}
