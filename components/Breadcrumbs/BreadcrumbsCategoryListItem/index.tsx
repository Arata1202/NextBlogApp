import { Category } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
  hasLink?: boolean;
};

export default function BreadcrumbsCategoryListItem({ category, hasLink = true }: Props) {
  if (hasLink) {
    return (
      <>
        <a href={`/category/${category.id}`} className={styles.category}>
          <p className={styles.category}>{category.name}</p>
        </a>
      </>
    );
  }
  return (
    <>
      <p className={styles.category}>{category.name}</p>
    </>
  );
}
