import { Category } from '@/libs/microcms';
import CategoryListItem from '../CategoryListItem';
import styles from './index.module.css';

type Props = {
  categories?: Category[];
  hasLink?: boolean;
};

export default function CategoryList({ categories, hasLink = true }: Props) {
  if (!categories) {
    return null;
  }
  return (
    <ul className={styles.tags}>
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryListItem category={category} hasLink={hasLink} />
        </li>
      ))}
    </ul>
  );
}
