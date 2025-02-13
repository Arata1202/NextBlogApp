import { Category } from '@/libs/microcms';
import BreadcrumbsCategoryListItem from '../BreadcrumbsCategoryListItem';
import styles from './index.module.css';

type Props = {
  categories?: Category[];
  hasLink?: boolean;
};

export default function PanTagList({ categories, hasLink = true }: Props) {
  if (!categories) {
    return null;
  }
  return (
    <ul className={styles.tags}>
      {categories.map((category) => (
        <li key={category.id}>
          <BreadcrumbsCategoryListItem category={category} hasLink={hasLink} />
        </li>
      ))}
    </ul>
  );
}
