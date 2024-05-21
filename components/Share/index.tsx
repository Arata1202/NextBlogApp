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
        <TwitterShareButton url="https://realunivlog.com" title="リアル大学生" className="m-1">
          <TwitterIcon size={40} round={true} />
        </TwitterShareButton>

        <FacebookShareButton url="https://realunivlog.com" title="リアル大学生" className="m-1">
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>

        <LineShareButton url="https://realunivlog.com" title="リアル大学生" className="m-1">
          <LineIcon size={40} round={true} />
        </LineShareButton>

        <HatenaShareButton url="https://realunivlog.com" title="リアル大学生" className="m-1">
          <HatenaIcon size={40} round={true} />
        </HatenaShareButton>

        <PinterestShareButton
          url="https://realunivlog.com"
          media="画像のURL"
          description="説明"
          className="m-1"
        >
          <PinterestIcon size={40} round={true} />
        </PinterestShareButton>

        <RedditShareButton url="https://realunivlog.com" title="リアル大学生" className="m-1">
          <RedditIcon size={40} round={true} />
        </RedditShareButton>

        <LinkedinShareButton
          url="https://realunivlog.com"
          title="リアル大学生"
          summary="要約"
          className="m-1"
        >
          <LinkedinIcon size={40} round={true} />
        </LinkedinShareButton>
      </div>
    </>
  );
}
