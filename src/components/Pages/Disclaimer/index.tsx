import { Article } from '@/libs/microcms';
import DisplayAd from '@/components/Common/ ThirdParties/GoogleAdSense/Elements/AdUnit';
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
      <DisplayAd slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
