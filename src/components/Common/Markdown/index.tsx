'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useHydratedTheme } from '@/hooks/useHydratedTheme';
import { PROFILE_IMAGE } from '@/constants/data';
import FixedContentContainer from '../Layouts/Container/FixedContentContainer';
import { getTextLinkClassName } from '@/components/Common/controlClassNames';

type Props = {
  content: string;
  profile?: boolean;
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

export default function Markdown({ content, profile = false }: Props) {
  const { theme } = useHydratedTheme();
  const linkClassName = getTextLinkClassName(theme);

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
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children, ...props }) => (
              <h2
                className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                {...props}
              >
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3
                className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
                {...props}
              >
                {children}
              </h3>
            ),
            h4: ({ children, ...props }) => (
              <h4
                className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
                {...props}
              >
                {children}
              </h4>
            ),
            a: ({ href, children, ...props }) => {
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
