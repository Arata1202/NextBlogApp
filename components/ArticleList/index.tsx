'use client';

import { Article } from '@/libs/microcms';
import ArticleListItem from '../ArticleListItem';
import styles from './index.module.css';

type Props = {
  articles?: Article[];
};

export default function ArticleList({ articles }: Props) {
  if (!articles) {
    return null;
  }
  if (articles.length === 0) {
    return <p>記事がありません。</p>;
  }
  return (
    <ul className={`${styles.main}`}>
      {articles.map((article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </ul>
  );
}
