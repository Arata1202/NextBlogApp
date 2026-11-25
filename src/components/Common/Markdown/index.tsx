'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useResolvedTheme } from '@/components/Common/useResolvedTheme';
import { useMemo } from 'react';
import { PROFILE_IMAGE } from '@/constants/data';
import FixedContentContainer from '../Layouts/Container/FixedContentContainer';
import CodeBlock from '@/components/Common/CodeBlock';
import { getTextLinkClassName } from '@/components/Common/controlClassNames';
import { getThemeVariantClassName, themeVariantClassNames } from '@/styles/uiClassNames';
import { SAFE_RESOURCE_PROTOCOLS, parseUrl } from '@/utils/urlSafety';

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

const MARKDOWN_LINK_BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.invalid/';
const MARKDOWN_LINK_BASE_URL = new URL(MARKDOWN_LINK_BASE);

const opensInNewTab = (href?: string) => {
  if (!href) {
    return false;
  }

  const url = parseUrl(href, MARKDOWN_LINK_BASE);

  return (
    Boolean(url) &&
    SAFE_RESOURCE_PROTOCOLS.has(url?.protocol ?? '') &&
    url?.origin !== MARKDOWN_LINK_BASE_URL.origin
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

function makeHeading(Tag: 'h2' | 'h3' | 'h4'): NonNullable<Components['h2']> {
  return function Heading({ node, children, ...props }) {
    void node;
    const theme = useResolvedTheme();
    const variant =
      Tag === 'h2' ? themeVariantClassNames.selectedSurface : themeVariantClassNames.borderedText;
    return (
      <Tag className={getThemeVariantClassName(theme, variant)} {...props}>
        {children}
      </Tag>
    );
  };
}

const renderers: Components = {
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
  h4: makeHeading('h4'),
  a: function MarkdownLink({ href, children, node, ...props }) {
    void node;
    const theme = useResolvedTheme();
    const external = opensInNewTab(href);
    return (
      <a
        className={getTextLinkClassName(theme)}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
        {external && <span className="sr-only">新しいタブで開きます</span>}
      </a>
    );
  },
  pre: ({ node, children, ...props }) => {
    void node;
    return <CodeBlock {...props}>{children}</CodeBlock>;
  },
};

export default function Markdown({ content, headingIds, profile = false }: Props) {
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
        <ReactMarkdown remarkPlugins={remarkPlugins} components={renderers}>
          {content}
        </ReactMarkdown>
      </FixedContentContainer>
    </>
  );
}
