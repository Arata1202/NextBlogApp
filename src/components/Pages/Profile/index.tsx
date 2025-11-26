import { Article, Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { YouTube } from '@/types/youtube';
import { PROFILE_CONTENT } from '@/contents/profile';
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

export default function ProfilePage({ articles, tags, archiveList, youtubeList }: Props) {
  const date = new Date(2023, 10, 27);

  return (
    <>
      <PageHeading profile={true} />
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          <Markdown content={PROFILE_CONTENT} profile={true} />
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
