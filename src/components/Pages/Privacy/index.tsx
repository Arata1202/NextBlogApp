import { Article, Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { YouTube } from '@/types/youtube';
import { PRIVACY_CONTENT } from '@/contents/privacy';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import Markdown from '@/components/Common/Markdown';
import PageHeading from '@/components/Common/PageHeading';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import FixedDateContainer from '@/components/Common/Layouts/Container/FIxedDateContainer';

type Props = {
  articles: Article[];
  tags: Tag[];
  archiveList: ArchiveItem[];
  youtubeList: YouTube[];
};

export default function PrivacyPage({ articles, tags, archiveList, youtubeList }: Props) {
  const date = new Date(2023, 10, 27);

  return (
    <>
      <PageHeading privacy={true} />
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          <Markdown content={PRIVACY_CONTENT} />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar
          recentArticles={articles}
          tags={tags}
          archiveList={archiveList}
          youtubeList={youtubeList}
        />
      </MainContainer>
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
