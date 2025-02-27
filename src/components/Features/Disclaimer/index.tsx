'use client';

import { Article } from '@/libs/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import SingleDate from '@/components/Common/SingleDate';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import AdAlert from '../../Common/AdAlert';
import Markdown from '@/components/Common/Markdown';
import { DisclaimerContent } from '@/contents/Disclaimer';

type Props = {
  articles: Article[];
};

export default function DisclaimerFeature({ articles }: Props) {
  const dummyDate = new Date(2023, 10, 27);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <>
      <MainContainer>
        <ContentContainer>
          <div className="space-y-5 lg:space-y-8">
            <div className="flex justify-end gap-x-5">
              <SingleDate date={formattedDate} />
            </div>
            <AdAlert />
          </div>
          <Markdown content={DisclaimerContent} />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} />
      </MainContainer>
    </>
  );
}
