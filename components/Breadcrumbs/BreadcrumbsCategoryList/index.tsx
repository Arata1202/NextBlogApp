import { Category } from '@/libs/microcms';
import BreadcrumbsCategoryListItem from '../BreadcrumbsCategoryListItem';
import styles from './index.module.css';

type Props = {
  tags?: Category[];
  hasLink?: boolean;
};

export default function PanTagList({ tags, hasLink = true }: Props) {
  if (!tags) {
    return null;
  }
  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag.id}>
          <BreadcrumbsCategoryListItem tag={tag} hasLink={hasLink} />
        </li>
      ))}
    </ul>
  );
}
