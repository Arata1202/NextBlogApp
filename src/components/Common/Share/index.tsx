'use client';

import { Article } from '@/types/microcms';
import ShareSection from './Elements/ShareSection';
import FollowSection from './Elements/FollowSection';
import SupportSection from './Elements/SupportSection';

type Props = {
  data?: Article;
};

export default function Share({ data }: Props) {
  return (
    <>
      <div className="mt-5">
        <ShareSection data={data} />
        <FollowSection />
        <SupportSection data={data} />
      </div>
    </>
  );
}
