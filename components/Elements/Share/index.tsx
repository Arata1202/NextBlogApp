'use client';

import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  HatenaShareButton,
  HatenaIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';
import { FireIcon, HandThumbUpIcon, RssIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { SiFeedly } from 'react-icons/si';
import { useTheme } from 'next-themes';

export default function Share() {
  const { theme } = useTheme();
  return (
    <>
      <div className="mb-7">
        <div className="pt-3">
          <h1
            className={`text-2xl font-semibold flex justify-center mb-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            <HandThumbUpIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            シェアする
          </h1>
        </div>
        <div className="flex justify-center">
          <TwitterShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1 hover:opacity-60"
          >
            <TwitterIcon size={40} round={true} />
          </TwitterShareButton>

          <FacebookShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1 hover:opacity-60"
          >
            <FacebookIcon size={40} round={true} />
          </FacebookShareButton>

          <LineShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1 hover:opacity-60"
          >
            <LineIcon size={40} round={true} />
          </LineShareButton>

          <HatenaShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1 hover:opacity-60"
          >
            <HatenaIcon size={40} round={true} />
          </HatenaShareButton>

          <PinterestShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            media="/images/head/realstudent512.png"
            description="リアル大学生"
            className="m-1 hover:opacity-60"
          >
            <PinterestIcon size={40} round={true} />
          </PinterestShareButton>

          <RedditShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1 hover:opacity-60"
          >
            <RedditIcon size={40} round={true} />
          </RedditShareButton>

          <LinkedinShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            summary="大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。"
            className="m-1 hover:opacity-60"
          >
            <LinkedinIcon size={40} round={true} />
          </LinkedinShareButton>
        </div>
        <div className="mt-2">
          <div className="pt-3">
            <h1
              className={`text-2xl font-semibold flex justify-center mb-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              <UserPlusIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              フォローする
            </h1>
          </div>
          <div className="flex justify-center">
            <a
              aria-label="RSSフォローボタン"
              href="https://realunivlog.com/rss.xml"
              className="bg-orange-500 rounded-full p-2 m-1 hover:opacity-60"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RssIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </a>
            <a
              aria-label="Feedlyフォローボタン"
              href="https://feedly.com/i/subscription/feed/https://realunivlog.com/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 rounded-full p-2 m-1 hover:opacity-60"
            >
              <SiFeedly className="h-6 w-6 text-white" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-2">
          <div className="pt-3">
            <h1
              className={`text-2xl font-semibold flex justify-center mb-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              <FireIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              応援する
            </h1>
          </div>
          <div className="flex justify-center">
            <a
              href="https://blogmura.com/profiles/11190305/?p_cid=11190305&reader=11190305"
              className="hover:opacity-60"
              target="_blank"
            >
              <img
                src="https://b.blogmura.com/banner-blogmura-reader-white-small.svg"
                loading="lazy"
                width="160"
                height="36"
                alt="リアル大学生 - にほんブログ村"
              />
            </a>
            <a
              href="https://blog.with2.net/link/?id=2117761"
              title="人気ブログランキング"
              target="_blank"
              className="ml-3 hover:opacity-60"
            >
              <img
                alt="人気ブログランキング"
                loading="lazy"
                width="93"
                height="36"
                src="https://blog.with2.net/img/banner/banner_22.gif"
              />
            </a>
            <a
              href="https://blogranking.fc2.com/in.php?id=1067087"
              target="_blank"
              className="ml-3 hover:opacity-60"
            >
              <img
                loading="lazy"
                src="https://static.fc2.com/blogranking/ranking_banner/a_02.gif"
              />
            </a>
          </div>
          <a href="https://www.buymeacoffee.com/realunivlog" target="_blank">
            <img
              width="160"
              loading="lazy"
              className="mt-5 m-auto hover:opacity-60"
              src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=realunivlog&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
            />
          </a>
        </div>
      </div>
    </>
  );
}
