import { Article } from '@/libs/microcms';
import AdUnit from '@/components/Common/ThirdParties/GoogleAdSense/AdUnit';
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
      <div className="mt-5">
        <AdUnit slot="5969933704" />
      </div>
    </>
  );
}
