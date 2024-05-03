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
    return <p className={`${styles.main}`}>記事がありません。</p>;
  }
  return (
    <div className={`${styles.main} flex w-full`}>
      <main className="w-8/12 bg-gray-100">
        <ul>
          {articles.map((article) => (
            <ArticleListItem key={article.id} article={article} />
          ))}
        </ul>
      </main>

      <aside className="w-4/12 ml-10 bg-gray-100">
        <h1>aa</h1>
      </aside>
    </div>
  );
}
