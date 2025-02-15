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
        <a href={`/category/${category.id}`}>
          <div className={styles.category}>{category.name}</div>
        </a>
      </>
    );
  }
  return (
    <>
      <div className={styles.category}>{category.name}</div>
    </>
  );
}
