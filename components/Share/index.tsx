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
import Image from 'next/image';
import { HandThumbUpIcon, RssIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { SiFeedly } from 'react-icons/si';

export default function Share() {
  return (
    <>
      <div className="mb-7">
        <div className="pt-3">
          <h1 className={`text-2xl font-semibold flex justify-center mb-5`}>
            <HandThumbUpIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            シェアする
          </h1>
        </div>
        <div className="flex justify-center">
          <TwitterShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1"
          >
            <TwitterIcon size={40} round={true} />
          </TwitterShareButton>

          <FacebookShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1"
          >
            <FacebookIcon size={40} round={true} />
          </FacebookShareButton>

          <LineShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1"
          >
            <LineIcon size={40} round={true} />
          </LineShareButton>

          <HatenaShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1"
          >
            <HatenaIcon size={40} round={true} />
          </HatenaShareButton>

          <PinterestShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            media="/images/head/realstudent512.png"
            description="リアル大学生"
            className="m-1"
          >
            <PinterestIcon size={40} round={true} />
          </PinterestShareButton>

          <RedditShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            className="m-1"
          >
            <RedditIcon size={40} round={true} />
          </RedditShareButton>

          <LinkedinShareButton
            aria-label="シェアボタン"
            url="https://realunivlog.com"
            title="リアル大学生"
            summary="大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。"
            className="m-1"
          >
            <LinkedinIcon size={40} round={true} />
          </LinkedinShareButton>
        </div>
        <div className="mt-2">
          <div className="pt-3">
            <h1 className={`text-2xl font-semibold flex justify-center mb-5`}>
              <UserPlusIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              フォローする
            </h1>
          </div>
          <div className="flex justify-center">
            <a
              aria-label="RSSフォローボタン"
              href="https://d1n5q2wwrdsa8j.cloudfront.net/rss.xml"
              className="bg-orange-500 rounded-full p-2 m-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RssIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </a>
            <a
              aria-label="Feedlyフォローボタン"
              href="https://feedly.com/i/subscription/feed/https://d1n5q2wwrdsa8j.cloudfront.net/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 rounded-full p-2 m-1"
            >
              <SiFeedly className="h-6 w-6 text-white" aria-hidden="true" />
            </a>
          </div>
          <div className="flex justify-center mt-5">
            <a
              href="https://blogmura.com/profiles/11190305/?p_cid=11190305&reader=11190305"
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
              className="ml-3"
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
              className="ml-3"
            >
              <img
                loading="lazy"
                src="https://static.fc2.com/blogranking/ranking_banner/a_02.gif"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
