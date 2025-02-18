'use client';

import { Article } from '@/libs/microcms';
import Display from '@/components/Adsense/Display';
import Disclaimer from '@/components/Features/Disclaimer';
import PageHeading from '@/components/Common/PageHeading';
import Sidebar from '@/components/Common/Layouts/Sidebar';

type Props = {
  articles: Article[];
};

export default function DisclaimerPage({ articles }: Props) {
  return (
    <>
      <PageHeading disclaimer={true} />
      <Disclaimer articles={articles} />
      <Sidebar allArticles={articles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
