import React from 'react';
import { Tag } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  tag: Tag;
  hasLink?: boolean;
};

export default function CategoryListItem({ tag, hasLink = true }: Props) {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = `/category/${tag.id}`;
  };
  if (hasLink) {
    return (
      <a onClick={handleClick} href={`/category/${tag.id}`} className={styles.tag}>
        <p className={styles.tag}>{tag.name}</p>
      </a>
    );
  }
  return <span className={styles.tag}>{tag.name}</span>;
}
