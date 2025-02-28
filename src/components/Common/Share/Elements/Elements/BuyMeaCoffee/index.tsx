import { Article } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  data?: Article;
};

export default function BuyMeaCoffee({ data }: Props) {
  const buyMeaCoffeeMessage = data?.id && data?.title ? 'この' : '';

  return (
    <div className={`${styles.BuyMeaCoffeeMessage} text-center mt-4`}>
      もし{buyMeaCoffeeMessage}記事が役に立ったなら、
      <br />
      こちらから ☕ を一杯支援いただけると喜びます
    </div>
  );
}
