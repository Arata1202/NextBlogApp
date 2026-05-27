import Link from 'next/link';
import { RssIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { SiFeedly } from 'react-icons/si';

export default function FollowSection() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const rssUrl = `${baseUrl}/rss.xml`;
  const feedlyUrl = `https://feedly.com/i/subscription/feed%2F${encodeURIComponent(rssUrl)}`;

  return (
    <>
      <div className="mt-5">
        <div className={`text-2xl font-semibold flex justify-center mb-5`}>
          <UserPlusIcon className="h-8 w-8 mr-2" />
          フォローする
        </div>
        <div className="flex justify-center">
          <Link
            href={rssUrl}
            className="bg-orange-500 rounded-full p-2 m-1 hover:opacity-60"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RSSフィードを開く"
          >
            <RssIcon className="h-6 w-6 text-white" />
          </Link>
          <Link
            href={feedlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 rounded-full p-2 m-1 hover:opacity-60"
            aria-label="Feedlyでフォロー"
          >
            <SiFeedly className="h-6 w-6 text-white" />
          </Link>
        </div>
      </div>
    </>
  );
}
