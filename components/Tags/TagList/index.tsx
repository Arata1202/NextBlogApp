import { Tag } from '@/libs/microcms';
import styles from './index.module.css';
import TagListItem from '../TagListItem';

type Props = {
  tags: Tag[];
  hasLink?: boolean;
};

export default function TagList({ tags, hasLink = true }: Props) {
  return (
    <>
      <ul className={styles.tags}>
        {tags.map((tag) => (
          <li key={tag.id}>
            <TagListItem tag={tag} hasLink={hasLink} />
          </li>
        ))}
      </ul>
    </>
  );
}
