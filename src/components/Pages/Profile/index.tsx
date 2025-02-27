import { Article } from '@/libs/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import ProfileFeature from '@/components/Features/Profile';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  articles: Article[];
};

export default function ProfilePage({ articles }: Props) {
  return (
    <>
      <PageHeading profile={true} />
      <ProfileFeature articles={articles} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
