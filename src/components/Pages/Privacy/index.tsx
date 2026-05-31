import { Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { PRIVACY_CONTENT } from '@/contents/privacy';
import { UnifiedArticle } from '@/types/unified';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import Markdown from '@/components/Common/Markdown';
import TableOfContents from '@/components/Common/TableOfContent';
import PageHeading from '@/components/Common/PageHeading';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import FixedDateContainer from '@/components/Common/Layouts/Container/FixedDateContainer';
import { extractMarkdownHeadings } from '@/utils/markdownHeadings';

const privacyHeadings = extractMarkdownHeadings(PRIVACY_CONTENT, 'privacy-heading');
const privacyHeadingIds = privacyHeadings.map((heading) => heading.id);

type Props = {
  recentArticles: UnifiedArticle[];
  tags: Tag[];
  archiveList: ArchiveItem[];
};

export default function PrivacyPage({ recentArticles, tags, archiveList }: Props) {
  const date = new Date('2023-11-27T00:00:00+09:00');

  return (
    <>
      <PageHeading page={{ type: 'privacy' }} />
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          {privacyHeadings.length > 0 && (
            <div className="mt-10">
              <TableOfContents headings={privacyHeadings} />
            </div>
          )}
          <Markdown content={PRIVACY_CONTENT} headingIds={privacyHeadingIds} />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={recentArticles} tags={tags} archiveList={archiveList} />
      </MainContainer>
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
