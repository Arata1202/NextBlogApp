import { Article } from '@/libs/microcms';
import DisplayAd from '@/components/Common/ ThirdParties/GoogleAdSense/Elements/AdUnit';
import CopyrightFeature from '@/components/Features/Copyright';
import PageHeading from '@/components/Common/PageHeading';
import Sidebar from '@/components/Common/Layouts/Sidebar';

type Props = {
  articles: Article[];
};

export default function CopyrightPage({ articles }: Props) {
  return (
    <>
      <PageHeading copyright={true} />
      <CopyrightFeature articles={articles} />
      <Sidebar recentArticles={articles} mobile={true} />
      <DisplayAd slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
