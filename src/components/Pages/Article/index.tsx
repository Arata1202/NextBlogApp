import { Article } from '@/libs/microcms';
import DisplayAd from '@/components/Common/ ThirdParties/GoogleAdSense/Elements/AdUnit';
import ArticleFeature from '@/components/Features/Article';

type Props = {
  articles: Article[];
  article: Article;
};

export default function ArticlePage({ article, articles }: Props) {
  return (
    <>
      <ArticleFeature data={article} articles={articles} />
      <DisplayAd slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
