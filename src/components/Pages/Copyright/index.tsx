import { Article } from '@/libs/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import CopyrightFeature from '@/components/Features/Copyright';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  articles: Article[];
};

export default function CopyrightPage({ articles }: Props) {
  return (
    <>
      <PageHeading copyright={true} />
      <CopyrightFeature articles={articles} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
