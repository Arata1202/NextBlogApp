import { Article } from '@/libs/microcms';
import Display from '@/components/Common/Adsense/Display';
import PrivacyFeature from '@/components/Features/Privacy';
import PageHeading from '@/components/Common/PageHeading';
import Sidebar from '@/components/Common/Layouts/Sidebar';

type Props = {
  articles: Article[];
};

export default function PrivacyPage({ articles }: Props) {
  return (
    <>
      <PageHeading privacy={true} />
      <PrivacyFeature articles={articles} />
      <Sidebar allArticles={articles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
