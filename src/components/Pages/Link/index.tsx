import { Article } from '@/types/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import LinkFeature from '@/components/Features/Link';
import PageHeading from '@/components/Common/PageHeading';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import FixedDateContainer from '@/components/Common/Layouts/Container/FIxedDateContainer';

type Props = {
  articles: Article[];
};

export default function LinkPage({ articles }: Props) {
  const date = new Date(2023, 10, 27);

  return (
    <>
      <PageHeading link={true} />
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          <LinkFeature />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} />
      </MainContainer>
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
