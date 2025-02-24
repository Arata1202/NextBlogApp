import { Article } from '@/libs/microcms';
import Display from '@/components/Common/ThirdParties/GoogleAdSense/Elements/AdUnit';
import ContactFeature from '@/components/Features/Contact';
import PageHeading from '@/components/Common/PageHeading';
import Sidebar from '@/components/Common/Layouts/Sidebar';

type Props = {
  articles: Article[];
};

export default function ContactPage({ articles }: Props) {
  return (
    <>
      <PageHeading contact={true} />
      <ContactFeature articles={articles} />
      <Sidebar recentArticles={articles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
