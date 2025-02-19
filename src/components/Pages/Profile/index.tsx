import { Article } from '@/libs/microcms';
import Display from '@/components/Common/Adsense/Display';
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
      <Sidebar allArticles={articles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
