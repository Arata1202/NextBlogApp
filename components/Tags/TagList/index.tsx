import { Tag2 } from '@/libs/microcms';
import TagListItem from '../TagListItem';
import styles from './index.module.css';

type Props = {
  tags?: Tag2[];
  hasLink?: boolean;
};

export default function TagList2({ tags, hasLink = true }: Props) {
  if (!tags) {
    return null;
  }
  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag.id}>
          <TagListItem tag={tag} hasLink={hasLink} />
        </li>
      ))}
    </ul>
  );
}
