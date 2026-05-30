import { Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { UnifiedArticle } from '@/types/unified';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import ContactFeature from '@/components/Features/Contact';
import PageHeading from '@/components/Common/PageHeading';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import FixedDateContainer from '@/components/Common/Layouts/Container/FIxedDateContainer';

type Props = {
  recentArticles: UnifiedArticle[];
  tags: Tag[];
  archiveList: ArchiveItem[];
};

export default function ContactPage({ recentArticles, tags, archiveList }: Props) {
  const date = new Date('2023-11-27T00:00:00+09:00');

  return (
    <>
      <PageHeading page={{ type: 'contact' }} />
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          <ContactFeature />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
      </MainContainer>
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
