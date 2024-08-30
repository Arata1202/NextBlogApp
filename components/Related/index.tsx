import Image from 'next/image';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  article: Article;
};

const RelatedArticleItem: React.FC<Props> = ({ article }) => {
  return (
    <li className={styles.item}>
      <a href={`/articles/${article.id}`}>
        <a className={styles.link}>
          {article.thumbnail ? (
            <Image
              src={article.thumbnail.url || '/no-image.png'}
              alt={article.title}
              className={styles.image}
              width={240}
              height={126}
              layout="responsive"
            />
          ) : (
            <div className={styles.noImage}>
              <p>No Image Available</p>
            </div>
          )}
          <div className={styles.content}>
            <h3 className={styles.title}>{article.title}</h3>
            <p className={styles.description}>{article.description}</p>
          </div>
        </a>
      </a>
    </li>
  );
};

export default RelatedArticleItem;
