'use client';

import { Article } from '@/libs/microcms';
import ShareSection from './Elements/ShareSection';
import SupportSection from './Elements/SupportSection';

type Props = {
  data?: Article;
};

export default function Share({ data }: Props) {
  return (
    <>
      <div className="mt-5">
        <ShareSection data={data} />
        <SupportSection data={data} />
      </div>
    </>
  );
}
