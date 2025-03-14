import { Article } from '@/types/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import ArticleFeature from '@/components/Features/Article';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import BreadCrumb from '@/components/Common/BreadCrumb';
import Share from '@/components/Common/Share';

type Props = {
  articles: Article[];
  article: Article;
};

export default function ArticlePage({ article, articles }: Props) {
  return (
    <>
      <MainContainer article={true}>
        <ContentContainer>
          <BreadCrumb article={article} />
          <ArticleFeature data={article} />
          <AdUnit slot="1831092739" />
          <Share data={article} />
        </ContentContainer>
        <Sidebar recentArticles={articles} contentBlocks={article.content_blocks} article={true} />
      </MainContainer>
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
