import { RssIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { SiFeedly } from 'react-icons/si';
import { roundIconControlClassName } from '@/components/Common/controlClassNames';

export default function FollowSection() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const rssUrl = `${baseUrl}/rss.xml`;
  const feedlyUrl = `https://feedly.com/i/subscription/feed%2F${encodeURIComponent(rssUrl)}`;

  return (
    <>
      <div className="mt-5">
        <div className={`text-2xl font-semibold flex justify-center mb-5`}>
          <UserPlusIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          フォローする
        </div>
        <div className="flex justify-center">
          <a
            href={rssUrl}
            className={`${roundIconControlClassName} bg-orange-500 p-2 m-1 hover:opacity-60`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RSSフィードを新しいタブで開く"
          >
            <RssIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </a>
          <a
            href={feedlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${roundIconControlClassName} bg-green-500 p-2 m-1 hover:opacity-60`}
            aria-label="Feedlyを新しいタブで開く"
          >
            <SiFeedly className="h-6 w-6 text-white" aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  );
}
