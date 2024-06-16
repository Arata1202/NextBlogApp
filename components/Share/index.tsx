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
              href="https://realunivlog.com/rss.xml"
              className="bg-orange-500 rounded-full p-1 m-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RssIcon className="h-8 w-8 text-white" aria-hidden="true" />
            </a>
            <a
              aria-label="Feedlyフォローボタン"
              href="https://feedly.com/i/subscription/feed/https://realunivlog.com/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 rounded-full p-1 m-1"
            >
              <SiFeedly className="h-8 w-8 text-white" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
