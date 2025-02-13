import { Category } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
  hasLink?: boolean;
};

export default function PanTagListItem({ category, hasLink = true }: Props) {
  if (hasLink) {
    return (
      <a href={`/category/${category.id}`} className={styles.tag}>
        <p className={styles.tag}>{category.name}</p>
      </a>
    );
  }
  return <span className={styles.tag}>{category.name}</span>;
}
