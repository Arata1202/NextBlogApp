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
      <ul className={styles.categories}>
        {categories.map((category) => (
          <li key={category.id}>
            <BreadcrumbsCategoryListItem category={category} hasLink={hasLink} />
          </li>
        ))}
      </ul>
    </>
  );
}
