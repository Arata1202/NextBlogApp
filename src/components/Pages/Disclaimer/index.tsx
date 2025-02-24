import { Article } from '@/libs/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import DisclaimerFeature from '@/components/Features/Disclaimer';
import PageHeading from '@/components/Common/PageHeading';
import Sidebar from '@/components/Common/Layouts/Sidebar';

type Props = {
  articles: Article[];
};

export default function DisclaimerPage({ articles }: Props) {
  return (
    <>
      <PageHeading disclaimer={true} />
      <DisclaimerFeature articles={articles} />
      <Sidebar recentArticles={articles} mobile={true} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
