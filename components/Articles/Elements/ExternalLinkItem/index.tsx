import { useEffect, useState } from 'react';
import styles from './index.module.css';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

interface ExternalLinkItemProps {
  url: string;
}

interface MetaData {
  title: string;
  description: string;
  image: string;
}

export default function ExternalLinkItem({ url }: ExternalLinkItemProps) {
  const [metaData, setMetaData] = useState<MetaData | null>(null);

  useEffect(() => {
    async function fetchMetadata() {
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      const json = await response.json();
      setMetaData(json);
    }
    fetchMetadata();
  }, [url]);

  if (!metaData) return null;

  return (
    <>
      <div className="flex mt-10">
        <ArrowTopRightOnSquareIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        <h1 className="text-2xl font-semibold mb-5">外部リンク</h1>
      </div>
      <li className={styles.list}>
        <a
          href={url}
          className={`${styles.link} p-2 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 cursor-pointer`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={metaData?.image || '/images/blog/no-image.png'}
            alt="サムネイル"
            className={styles.image}
            width="600"
            height="300"
          />
          <div className={styles.content}>
            <div className={styles.title}>{metaData?.title}</div>
            <div className={styles.description}>{metaData?.description}</div>
          </div>
        </a>
      </li>
    </>
  );
}
