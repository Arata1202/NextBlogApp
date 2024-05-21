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

import { HandThumbUpIcon } from '@heroicons/react/24/solid';

export default function Share() {
  return (
    <>
      <div className="pt-10">
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
    </>
  );
}
