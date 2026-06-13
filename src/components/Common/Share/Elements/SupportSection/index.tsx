'use client';

import { useTheme } from 'next-themes';
import { FireIcon } from '@heroicons/react/24/solid';
import { Article } from '@/types/microcms';
import BuyMeaCoffee from '../Elements/BuyMeaCoffee';
import { getThemeClassName } from '@/styles/designTokens';

type Props = {
  data?: Article;
};

export default function SupportSection({ data }: Props) {
  const { theme } = useTheme();
  const themeClassName = getThemeClassName(theme);

  return (
    <div className="mt-5">
      <div className={`text-2xl font-semibold flex justify-center mb-5 ${themeClassName}`}>
        <FireIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        応援する
      </div>
      <div className="flex justify-center">
        <a
          href="https://blogmura.com/profiles/11190305/?p_cid=11190305&reader=11190305"
          className="hover:opacity-60"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="にほんブログ村を新しいタブで開く"
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
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 hover:opacity-60"
          aria-label="人気ブログランキングを新しいタブで開く"
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
          rel="noopener noreferrer"
          className="ml-3 hover:opacity-60"
          aria-label="FC2ブログランキングを新しいタブで開く"
        >
          <img
            src="https://static.fc2.com/blogranking/ranking_banner/a_02.gif"
            alt="FC2ブログランキング"
            loading="lazy"
            width="92"
            height="34"
          />
        </a>
      </div>
      <BuyMeaCoffee data={data} />
    </div>
  );
}
