import { Article } from '@/types/microcms';
import { LINK_CONTENT } from '@/contents/link';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import Markdown from '@/components/Common/Markdown';
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
          <Markdown content={LINK_CONTENT} />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} />
      </MainContainer>
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
