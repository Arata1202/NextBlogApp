import { Article } from '@/types/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import DisclaimerFeature from '@/components/Features/Disclaimer';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  articles: Article[];
};

export default function DisclaimerPage({ articles }: Props) {
  return (
    <>
      <PageHeading disclaimer={true} />
      <DisclaimerFeature articles={articles} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
