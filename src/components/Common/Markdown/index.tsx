'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'next-themes';
import { PROFILE_IMAGE } from '@/constants/data';
import FixedContentContainer from '../Layouts/Container/FixedContentContainer';

type Props = {
  content: string;
  profile?: boolean;
};

export default function Markdown({ content, profile = false }: Props) {
  const { theme } = useTheme();
  const linkClassName =
    theme === 'dark'
      ? 'text-blue-300 underline underline-offset-2 hover:text-blue-200'
      : 'text-blue-700 underline underline-offset-2 hover:text-blue-800';

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
              const isInternalLink = href?.startsWith('/');

              return (
                <a
                  className={linkClassName}
                  href={href}
                  target={isInternalLink ? undefined : '_blank'}
                  rel={isInternalLink ? undefined : 'noopener noreferrer'}
                  {...props}
                >
                  {children}
                  {!isInternalLink && <span className="sr-only">新しいタブで開きます</span>}
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
