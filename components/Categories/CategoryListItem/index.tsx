import React from 'react';
import { Category } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
  hasLink?: boolean;
};

export default function CategoryListItem({ category, hasLink = true }: Props) {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = `/category/${category.id}`;
  };
  if (hasLink) {
    return (
      <a onClick={handleClick} href={`/category/${category.id}`} className={styles.tag}>
        <p className={styles.tag}>{category.name}</p>
      </a>
    );
  }
  return <span className={styles.tag}>{category.name}</span>;
}
