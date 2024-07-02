import Link from 'next/link';
import { Tag2 } from '@/libs/microcms';
import styles from './index.module.css';
import { HashtagIcon } from '@heroicons/react/24/outline';

type Props = {
  tag: Tag2;
  hasLink?: boolean;
};

export default function TagListItem2({ tag, hasLink = true }: Props) {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = `/tag/${tag.id}`;
  };
  if (hasLink) {
    return (
      <a onClick={handleClick} href={`/tag/${tag.id}`} className={styles.tag}>
        <HashtagIcon className="h-5 w-5 mt-1" aria-hidden="true" />
        <p className={styles.tag}>{tag.name}</p>
      </a>
    );
  }
  return <span className={styles.tag}>{tag.name}</span>;
}
