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
      <div className={styles.categories}>
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryListItem category={category} hasLink={hasLink} />
          </div>
        ))}
      </div>
    </>
  );
}
