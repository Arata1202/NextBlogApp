'use client';

import { Tag } from '@/libs/microcms';
import CategoryList from '@/components/CategoryList';
import SearchField from '@/components/SearchField';
import styles from './index.module.css';

type Props = {
  tags: Tag[];
};

export default function Nav({ tags }: Props) {
  return (
    <nav className={styles.nav}>
      <SearchField />
      <CategoryList tags={tags} />
    </nav>
  );
}
