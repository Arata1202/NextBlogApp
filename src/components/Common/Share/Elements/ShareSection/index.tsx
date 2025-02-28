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
import { Article } from '@/libs/Microcms';

type Props = {
  data?: Article;
};

export default function ShareSection({ data }: Props) {
  const { theme } = useTheme();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const baseTitle = process.env.NEXT_PUBLIC_BASE_TITLE;
  const title = data ? `${data.title}｜${baseTitle}` : `${baseTitle}`;
  const url = data ? `${baseUrl}/articles/${data.id}` : `${baseUrl}`;

  return (
    <>
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
    </>
  );
}
