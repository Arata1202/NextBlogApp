import Link from 'next/link';
import { Article } from '@/types/microcms';
import styles from './index.module.css';
import { interactiveFocusClassName } from '@/components/Common/controlClassNames';

type Props = {
  data?: Article;
  sidebar?: boolean;
};

export default function BuyMeaCoffee({ data, sidebar = false }: Props) {
  const buyMeaCoffeeMessage = (data?.id && data?.title) || sidebar ? 'この' : '';

  return (
    <>
      <Link
        href="https://www.buymeacoffee.com/realunivlog"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="BuyMeaCoffeeを新しいタブで開く"
        className={`mx-auto mt-5 flex w-fit rounded-md hover:opacity-60 ${interactiveFocusClassName}`}
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="BuyMeaCoffee"
          loading="lazy"
          width="160"
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
