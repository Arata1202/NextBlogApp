import { useTheme } from 'next-themes';
import { FireIcon } from '@heroicons/react/24/solid';
import { Article } from '@/libs/microcms';
import BuyMeaCoffee from '../Elements/BuyMeaCoffee';

type Props = {
  data?: Article;
};

export default function SupportSection({ data }: Props) {
  const { theme } = useTheme();

  return (
    <div className="mt-5">
      <div
        className={`text-2xl font-semibold flex justify-center mb-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <FireIcon className="h-8 w-8 mr-2" />
        応援する
      </div>
      <div className="flex justify-center">
        <a
          href="https://blogmura.com/profiles/11190305/?p_cid=11190305&reader=11190305"
          className="hover:opacity-60"
          target="_blank"
        >
          <img
            src="https://b.blogmura.com/banner-blogmura-reader-white-small.svg"
            alt="にほんブログ村"
            loading="lazy"
            width="160"
            height="36"
          />
        </a>
        <a
          href="https://blog.with2.net/link/?id=2117761"
          title="人気ブログランキング"
          target="_blank"
          className="ml-3 hover:opacity-60"
        >
          <img
            src="https://blog.with2.net/img/banner/banner_22.gif"
            alt="人気ブログランキング"
            loading="lazy"
            width="93"
            height="36"
          />
        </a>
        <a
          href="https://blogranking.fc2.com/in.php?id=1067087"
          target="_blank"
          className="ml-3 hover:opacity-60"
        >
          <img
            src="https://static.fc2.com/blogranking/ranking_banner/a_02.gif"
            alt="FC2ブログランキング"
            loading="lazy"
          />
        </a>
      </div>
      <a href="https://www.buymeacoffee.com/realunivlog" target="_blank">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="BuyMeaCoffee"
          loading="lazy"
          width="160"
          className="mt-5 m-auto hover:opacity-60"
        />
      </a>
      <BuyMeaCoffee data={data} />
    </div>
  );
}
