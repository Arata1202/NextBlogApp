import { Article } from '@/libs/Microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import LinkFeature from '@/components/Features/Link';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  articles: Article[];
};

export default function LinkPage({ articles }: Props) {
  return (
    <>
      <PageHeading link={true} />
      <LinkFeature articles={articles} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
