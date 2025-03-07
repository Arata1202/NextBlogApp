import Link from 'next/link';
import { Article } from '@/types/microcms';
import styles from './index.module.css';

type Props = {
  data?: Article;
  sidebar?: boolean;
};

export default function BuyMeaCoffee({ data, sidebar = false }: Props) {
  const buyMeaCoffeeMessage = (data?.id && data?.title) || sidebar ? 'この' : '';

  return (
    <>
      <Link href="https://www.buymeacoffee.com/realunivlog" target="_blank">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="BuyMeaCoffee"
          loading="lazy"
          width="160"
          className="mt-5 m-auto hover:opacity-60"
        />
      </Link>
      <div className={`${styles.BuyMeaCoffeeMessage} text-center mt-4`}>
        もし{buyMeaCoffeeMessage}記事が役に立ったなら、
        <br />
        こちらから ☕ を一杯支援いただけると喜びます
      </div>
    </>
  );
}
