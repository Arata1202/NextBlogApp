import { Tag } from '@/libs/microcms';
import styles from './index.module.css';
import TagListItem from '../TagListItem';

type Props = {
  tags: Tag[];
  hasLink?: boolean;
};

export default function TagList({ tags, hasLink = true }: Props) {
  return (
    <>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <div key={tag.id}>
            <TagListItem tag={tag} hasLink={hasLink} />
          </div>
        ))}
      </div>
    </>
  );
}
