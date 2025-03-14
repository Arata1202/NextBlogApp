import { Article } from '@/types/microcms';
import styles from './index.module.css';

type Props = {
  article: Article;
  card?: boolean;
};

export default function WebpImage({ article, card = false }: Props) {
  return (
    <picture>
      <source
        type="image/webp"
        media="(max-width: 640px)"
        srcSet={`${article.thumbnail.url}?fm=webp&w=414 1x, ${article.thumbnail.url}?fm=webp&w=414&dpr=2 2x`}
      />
      <source
        type="image/webp"
        srcSet={`${article.thumbnail.url}?fm=webp&fit=crop&w=${(card && '240') || '960'}&h=${(card && '126') || '504'} 1x, ${article.thumbnail.url}?fm=webp&fit=crop&w=${(card && '240') || '960'}&h=${(card && '126') || '504'}&dpr=2 2x`}
      />
      <img
        src={article.thumbnail.url}
        alt="サムネイル"
        className={(card && styles.image) || styles.thumbnail}
        width={article.thumbnail.width}
        height={article.thumbnail.height}
      />
    </picture>
  );
}
