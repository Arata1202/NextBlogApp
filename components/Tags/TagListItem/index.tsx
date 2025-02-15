import React from 'react';
import { HashtagIcon } from '@heroicons/react/24/outline';
import { Tag } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  tag: Tag;
  hasLink?: boolean;
};

export default function TagListItem({ tag, hasLink = true }: Props) {
  if (hasLink) {
    return (
      <>
        <a href={`/tag/${tag.id}`}>
          <HashtagIcon className="h-5 w-5 mt-1" />
          <div className={styles.tag}>{tag.name}</div>
        </a>
      </>
    );
  }
  return (
    <>
      <div className={styles.tag}>{tag.name}</div>
    </>
  );
}
