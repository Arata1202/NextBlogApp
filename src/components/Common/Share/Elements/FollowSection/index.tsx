import Link from 'next/link';
import { RssIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { SiFeedly } from 'react-icons/si';

export default function FollowSection() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const url = baseUrl;

  return (
    <>
      <div className="mt-5">
        <div className={`text-2xl font-semibold flex justify-center mb-5`}>
          <UserPlusIcon className="h-8 w-8 mr-2" />
          フォローする
        </div>
        <div className="flex justify-center">
          <Link
            href={`${url}/rss.xml`}
            className="bg-orange-500 rounded-full p-2 m-1"
            target="_blank"
          >
            <RssIcon className="h-6 w-6 text-white" />
          </Link>
          <Link
            href={`https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Frealunivlog.com%2Frss.xml`}
            target="_blank"
            className="bg-green-500 rounded-full p-2 m-1"
          >
            <SiFeedly className="h-6 w-6 text-white" />
          </Link>
        </div>
      </div>
    </>
  );
}
