'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { PROFILE_IMAGE } from '@/constants/data';
import FixedContentContainer from '../Layouts/Container/FixedContentContainer';
import { getTextLinkClassName } from '@/components/Common/controlClassNames';

type Props = {
  content: string;
  headingIds?: string[];
  profile?: boolean;
};

type MarkdownAstNode = {
  type?: string;
  depth?: number;
  data?: {
    hProperties?: Record<string, unknown>;
  };
  children?: MarkdownAstNode[];
};

const opensInNewTab = (href?: string) => {
  if (!href) {
    return false;
  }

  const normalizedHref = href.trim().toLowerCase();

  return (
    normalizedHref !== '' &&
    !normalizedHref.startsWith('/') &&
    !normalizedHref.startsWith('#') &&
    !normalizedHref.startsWith('mailto:') &&
    !normalizedHref.startsWith('tel:')
  );
};

const createHeadingIdPlugin = (headingIds: string[]) => () => (tree: MarkdownAstNode) => {
  let index = 0;

  const visit = (node: MarkdownAstNode) => {
    if (
      node.type === 'heading' &&
      typeof node.depth === 'number' &&
      node.depth >= 2 &&
      node.depth <= 5
    ) {
      const id = headingIds[index];
      index += 1;

      if (id) {
        node.data = {
          ...node.data,
          hProperties: {
            ...node.data?.hProperties,
            id,
          },
        };
      }
    }

    node.children?.forEach(visit);
  };

  visit(tree);
};

export default function Markdown({ content, headingIds, profile = false }: Props) {
  const { theme } = useTheme();
  const linkClassName = getTextLinkClassName(theme);
  const remarkPlugins = useMemo(
    () => (headingIds ? [remarkGfm, createHeadingIdPlugin(headingIds)] : [remarkGfm]),
    [headingIds],
  );

  return (
    <>
      {profile && (
        <div className="flex justify-center">
          {PROFILE_IMAGE.map((item) => (
            <img
              key={item.path}
              src={item.path}
              alt={item.alt}
              width={300}
              height={300}
              className="mt-10"
            />
          ))}
        </div>
      )}
      <FixedContentContainer>
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          components={{
            h2: ({ children, node, ...props }) => {
              void node;

              return (
                <h2
                  className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                  {...props}
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children, node, ...props }) => {
              void node;

              return (
                <h3
                  className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
                  {...props}
                >
                  {children}
                </h3>
              );
            },
            h4: ({ children, node, ...props }) => {
              void node;

              return (
                <h4
                  className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
                  {...props}
                >
                  {children}
                </h4>
              );
            },
            a: ({ href, children, node, ...props }) => {
              void node;

              const shouldOpenInNewTab = opensInNewTab(href);

              return (
                <a
                  className={linkClassName}
                  href={href}
                  target={shouldOpenInNewTab ? '_blank' : undefined}
                  rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                  {shouldOpenInNewTab && <span className="sr-only">新しいタブで開きます</span>}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </FixedContentContainer>
    </>
  );
}
