'use client';

import { Article } from '@/libs/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import Markdown from '@/components/Common/Markdown';
import { DisclaimerContent } from '@/contents/disclaimer';
import FixedDateContainer from '@/components/Common/Layouts/Container/FIxedDateContainer';

type Props = {
  articles: Article[];
};

export default function DisclaimerFeature({ articles }: Props) {
  const date = new Date(2023, 10, 27);

  return (
    <>
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          <Markdown content={DisclaimerContent} />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} />
      </MainContainer>
    </>
  );
}
