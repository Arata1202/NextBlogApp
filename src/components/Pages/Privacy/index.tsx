import { Article } from '@/libs/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import PrivacyFeature from '@/components/Features/Privacy';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  articles: Article[];
};

export default function PrivacyPage({ articles }: Props) {
  return (
    <>
      <PageHeading privacy={true} />
      <PrivacyFeature articles={articles} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
