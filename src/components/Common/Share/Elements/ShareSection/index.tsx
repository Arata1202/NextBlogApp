'use client';

import { useTheme } from 'next-themes';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';
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
import { Article } from '@/types/microcms';
import { roundIconControlClassName } from '@/components/Common/controlClassNames';
import { getThemeClassName } from '@/styles/designTokens';

type Props = {
  data?: Article;
};

export default function ShareSection({ data }: Props) {
  const { theme } = useTheme();
  const themeClassName = getThemeClassName(theme);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const baseTitle = process.env.NEXT_PUBLIC_BASE_TITLE;
  const title = data ? `${data.title}｜${baseTitle}` : `${baseTitle}`;
  const url = data ? `${baseUrl}/articles/${data.id}` : `${baseUrl}`;

  return (
    <>
      <div className={`text-2xl font-semibold flex justify-center mb-5 ${themeClassName}`}>
        <HandThumbUpIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        シェアする
      </div>
      <div className="flex justify-center flex-wrap">
        <TwitterShareButton
          url={url}
          title={title}
          className={`${roundIconControlClassName} m-1 hover:opacity-60`}
          aria-label="Xでシェア"
        >
          <XIcon size={40} round={true} aria-hidden="true" />
        </TwitterShareButton>

        <FacebookShareButton
          url={url}
          className={`${roundIconControlClassName} m-1 hover:opacity-60`}
          aria-label="Facebookでシェア"
        >
          <FacebookIcon size={40} round={true} aria-hidden="true" />
        </FacebookShareButton>

        <LineShareButton
          url={url}
          title={title}
          className={`${roundIconControlClassName} m-1 hover:opacity-60`}
          aria-label="LINEでシェア"
        >
          <LineIcon size={40} round={true} aria-hidden="true" />
        </LineShareButton>

        <PocketShareButton
          url={url}
          title={title}
          className={`${roundIconControlClassName} m-1 hover:opacity-60`}
          aria-label="Pocketに保存"
        >
          <PocketIcon size={40} round={true} aria-hidden="true" />
        </PocketShareButton>

        <HatenaShareButton
          url={url}
          title={title}
          className={`${roundIconControlClassName} m-1 hover:opacity-60`}
          aria-label="はてなブックマークでシェア"
        >
          <HatenaIcon size={40} round={true} aria-hidden="true" />
        </HatenaShareButton>
      </div>
    </>
  );
}
