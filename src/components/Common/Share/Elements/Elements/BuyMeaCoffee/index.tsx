import { interactiveFocusClassName } from '@/components/Common/controlClassNames';
import { radiusClassNames } from '@/styles/uiClassNames';
import { Article } from '@/types/microcms';
import styles from './index.module.css';

type Props = {
  data?: Article;
  sidebar?: boolean;
};

export default function BuyMeACoffee({ data, sidebar = false }: Props) {
  const buyMeACoffeeMessage = (data?.id && data?.title) || sidebar ? 'この' : '';

  return (
    <>
      <a
        href="https://www.buymeacoffee.com/realunivlog"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buy Me a Coffeeを新しいタブで開く"
        className={`mx-auto mt-5 flex w-fit ${radiusClassNames.control} hover:opacity-60 ${interactiveFocusClassName}`}
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me a Coffee"
          loading="lazy"
          height="45"
          width="160"
        />
      </a>
      <div
        className={`${styles.BuyMeaCoffeeMessage} text-center mt-4`}
        data-main-buy-me-a-coffee-end={sidebar ? undefined : ''}
      >
        もし{buyMeACoffeeMessage}記事が役に立ったなら、
        <br />
        こちらから ☕ を一杯支援いただけると喜びます
      </div>
    </>
  );
}
