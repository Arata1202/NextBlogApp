import React from 'react';
import { Category } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
  hasLink?: boolean;
};

export default function CategoryListItem({ category, hasLink = true }: Props) {
  if (hasLink) {
    return (
      <>
        <a href={`/category/${category.id}`}>
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
