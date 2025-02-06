import { useEffect, useState } from 'react';
import styles from './index.module.css';

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

  return (
    <li className={styles.list}>
      <a
        href={url}
        className={`${styles.link} p-2 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 cursor-pointer`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={metaData?.image}
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
  );
}
