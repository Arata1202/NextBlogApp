import { Tag } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  tag: Tag;
  hasLink?: boolean;
};

export default function PanTagListItem({ tag, hasLink = true }: Props) {
  if (hasLink) {
    return (
      <a href={`/category/${tag.id}`} className={styles.tag}>
        <p className={styles.tag}>{tag.name}</p>
      </a>
    );
  }
  return <span className={styles.tag}>{tag.name}</span>;
}
