import Link from 'next/link';
import { Tag2 } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  tag: Tag2;
  hasLink?: boolean;
};

export default function TagListItem2({ tag, hasLink = true }: Props) {
  if (hasLink) {
    return (
      <Link href={`/tag/${tag.id}`} className={styles.tag}>
        <p className={styles.tag}>{tag.name}</p>
      </Link>
    );
  }
  return <span className={styles.tag}>{tag.name}</span>;
}
