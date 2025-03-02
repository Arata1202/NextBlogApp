import { Article } from '@/types/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import ContactFeature from '@/components/Features/Contact';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  articles: Article[];
};

export default function ContactPage({ articles }: Props) {
  return (
    <>
      <PageHeading contact={true} />
      <ContactFeature articles={articles} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
