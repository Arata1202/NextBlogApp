'use client';

import { useTheme } from 'next-themes';
import { FireIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import {
  TwitterShareButton,
  XIcon,
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  HatenaShareButton,
  HatenaIcon,
  PocketShareButton,
  PocketIcon,
} from 'react-share';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  data?: Article;
};

export default function Share({ data }: Props) {
  const { theme } = useTheme();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const baseTitle = process.env.NEXT_PUBLIC_BASE_TITLE;
  const title = data ? `${data.title}｜${baseTitle}` : `${baseTitle}`;
  const url = data ? `${baseUrl}/articles/${data.id}` : `${baseUrl}`;
  const buyMeaCoffeeMessage = data?.id && data?.title ? 'この' : '';

  return (
    <>
      <div className="mt-5">
        <div
          className={`text-2xl font-semibold flex justify-center mb-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
        >
          <HandThumbUpIcon className="h-8 w-8 mr-2" />
          シェアする
        </div>
        <div className="flex justify-center flex-wrap">
          <TwitterShareButton url={url} title={title} className="m-1 hover:opacity-60">
            <XIcon size={40} round={true} />
          </TwitterShareButton>

          <FacebookShareButton url={url} className="m-1 hover:opacity-60">
            <FacebookIcon size={40} round={true} />
          </FacebookShareButton>

          <LineShareButton url={url} title={title} className="m-1 hover:opacity-60">
            <LineIcon size={40} round={true} />
          </LineShareButton>

          <PocketShareButton url={url} title={title} className="m-1 hover:opacity-60">
            <PocketIcon size={40} round={true} />
          </PocketShareButton>

          <HatenaShareButton url={url} title={title} className="m-1 hover:opacity-60">
            <HatenaIcon size={40} round={true} />
          </HatenaShareButton>
        </div>

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
          <div className={`${styles.BuyMeaCoffeeMessage} text-center mt-4`}>
            もし{buyMeaCoffeeMessage}記事が役に立ったなら、
            <br />
            こちらから ☕ を一杯支援いただけると喜びます
          </div>
        </div>
      </div>
    </>
  );
}
