import { Tag } from '@/libs/microcms';
import PanTagListItem from '../PanTagListItem';
import styles from './index.module.css';

type Props = {
  tags?: Tag[];
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
          <PanTagListItem tag={tag} hasLink={hasLink} />
        </li>
      ))}
    </ul>
  );
}
