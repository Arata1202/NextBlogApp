import { Article } from '@/libs/microcms';
import Display from '@/components/Common/Adsense/Display';
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
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
