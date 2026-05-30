import { Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { LINK_CONTENT } from '@/contents/link';
import { UnifiedArticle } from '@/types/unified';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import Markdown from '@/components/Common/Markdown';
import PageHeading from '@/components/Common/PageHeading';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import FixedDateContainer from '@/components/Common/Layouts/Container/FixedDateContainerTmp';

type Props = {
  recentArticles: UnifiedArticle[];
  tags: Tag[];
  archiveList: ArchiveItem[];
};

export default function LinkPage({ recentArticles, tags, archiveList }: Props) {
  const date = new Date('2023-11-27T00:00:00+09:00');

  return (
    <>
      <PageHeading page={{ type: 'link' }} />
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          <Markdown content={LINK_CONTENT} />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
      </MainContainer>
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
