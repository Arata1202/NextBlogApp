import { Tag } from '@/libs/microcms';
import CategoryListItem from '../CategoryListItem';
import styles from './index.module.css';

type Props = {
  tags?: Tag[];
  hasLink?: boolean;
};

export default function CategoryList({ tags, hasLink = true }: Props) {
  if (!tags) {
    return null;
  }
  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag.id}>
          <CategoryListItem tag={tag} hasLink={hasLink} />
        </li>
      ))}
    </ul>
  );
}
