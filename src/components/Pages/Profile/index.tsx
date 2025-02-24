import { Article } from '@/libs/microcms';
import DisplayAd from '@/components/Common/ ThirdParties/GoogleAdSense/Elements/AdUnit';
import ProfileFeature from '@/components/Features/Profile';
import PageHeading from '@/components/Common/PageHeading';
import Sidebar from '@/components/Common/Layouts/Sidebar';

type Props = {
  articles: Article[];
};

export default function ProfilePage({ articles }: Props) {
  return (
    <>
      <PageHeading profile={true} />
      <ProfileFeature articles={articles} />
      <Sidebar recentArticles={articles} mobile={true} />
      <DisplayAd slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
