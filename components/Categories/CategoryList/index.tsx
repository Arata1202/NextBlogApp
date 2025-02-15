import { Category } from '@/libs/microcms';
import styles from './index.module.css';
import CategoryListItem from '../CategoryListItem';

type Props = {
  categories: Category[];
  hasLink?: boolean;
};

export default function CategoryList({ categories, hasLink = true }: Props) {
  return (
    <>
      <ul className={styles.categories}>
        {categories.map((category) => (
          <li key={category.id}>
            <CategoryListItem category={category} hasLink={hasLink} />
          </li>
        ))}
      </ul>
    </>
  );
}
