import { Category } from '@/libs/microcms';
import styles from './index.module.css';
import BreadcrumbsCategoryListItem from '../BreadcrumbsCategoryListItem';

type Props = {
  categories: Category[];
  hasLink?: boolean;
};

export default function BreadcrumbsCategoryList({ categories, hasLink = true }: Props) {
  return (
    <>
      <div className={styles.categories}>
        {categories.map((category) => (
          <div key={category.id}>
            <BreadcrumbsCategoryListItem category={category} hasLink={hasLink} />
          </div>
        ))}
      </div>
    </>
  );
}
