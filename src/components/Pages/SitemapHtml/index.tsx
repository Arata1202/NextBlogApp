import { Article, Category } from '@/types/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import SitemapHtmlFeature from '@/components/Features/SitemapHtml';
import PageHeading from '@/components/Common/PageHeading';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import FixedDateContainer from '@/components/Common/Layouts/Container/FIxedDateContainer';

type Props = {
  articles: Article[];
  categories: Category[];
};

export default function SitemapHtmlPage({ articles, categories }: Props) {
  const date = new Date(2023, 10, 27);

  return (
    <>
      <PageHeading sitemap={true} />
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          <SitemapHtmlFeature articles={articles} categories={categories} />
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} />
      </MainContainer>
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
