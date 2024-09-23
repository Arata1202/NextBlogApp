import styles from './index.module.css';
import { Writer } from '@/libs/microcms';

type Props = {
  writer?: Writer;
};

export default function Profile({ writer }: Props) {
  if (!writer) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <picture>
        <source
          type="image/webp"
          srcSet={`${writer?.image?.url}?fm=webp&fit=crop&96&h=96 1x, ${writer?.image?.url}?fm=webp&fit=crop&w=96&h=96&dpr=2 2x`}
        />
      </picture>
      <div className={styles.content}>
        <p className={styles.name}>{writer?.name}</p>
        <p className={styles.profile}>{writer?.profile}</p>
      </div>
    </div>
  );
}
