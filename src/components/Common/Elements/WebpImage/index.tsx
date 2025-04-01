import { Article } from '@/types/microcms';
import styles from './index.module.css';

type Props = {
  article: Article;
  card?: boolean;
  recent?: boolean;
};

export default function WebpImage({ article, card = false, recent = false }: Props) {
  return (
    <picture>
      <source
        type="image/webp"
        media="(max-width: 640px)"
        srcSet={`${article.thumbnail?.url}?fm=webp&q=60&fit=crop&w=${(card && '240') || '960'}&h=${(card && '126') || '504'} 1x, ${article.thumbnail?.url}?fm=webp&q=60&fit=crop&w=${(card && '240') || '960'}&h=${(card && '126') || '504'}&dpr=2 2x`}
      />
      <source
        type="image/webp"
        srcSet={`${article.thumbnail?.url}?fm=webp&q=60&fit=crop&w=${(card && '240') || '960'}&h=${(card && '126') || '504'} 1x, ${article.thumbnail?.url}?fm=webp&q=60&fit=crop&w=${(card && '240') || '960'}&h=${(card && '126') || '504'}&dpr=2 2x`}
      />
      <img
        src={`${article.thumbnail?.url}?fm=webp&q=60&fit=crop&w=${(card && '240') || '960'}&h=${(card && '126') || '504'} 1x, ${article.thumbnail?.url}?fm=webp&q=60&fit=crop&w=${(card && '240') || '960'}&h=${(card && '126') || '504'}&dpr=2 2x`}
        alt="サムネイル"
        className={(card && styles.image) || (recent && styles.recent) || styles.thumbnail}
        width={article.thumbnail?.width}
        height={article.thumbnail?.height}
      />
    </picture>
  );
}
