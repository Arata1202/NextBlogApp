import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'next-themes';
import styles from './index.module.css';

type Props = {
  content: string;
  profile?: boolean;
};

export default function Markdown({ content, profile = false }: Props) {
  const { theme } = useTheme();

  return (
    <>
      {profile && (
        <div className="flex justify-center">
          <img
            src="/images/blog/face.webp"
            alt="筆者のイメージ"
            width={300}
            height={300}
            className="mt-10"
          />
        </div>
      )}
      <div className={`${styles.content} mt-10 mb-5`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ ...props }) => (
              <h2
                className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                {...props}
              />
            ),
            h3: ({ ...props }) => (
              <h3
                className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
                {...props}
              />
            ),
            h4: ({ ...props }) => (
              <h4
                className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
                {...props}
              />
            ),
            a: ({ ...props }) => (
              <a className="text-blue-500 hover:text-blue-700" target="_blank" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
}
