import { Article } from '@/libs/microcms';
import AdUnit from '@/components/Common/ThirdParties/GoogleAdSense/AdUnit';
import ArticleFeature from '@/components/Features/Article';

type Props = {
  articles: Article[];
  article: Article;
};

export default function ArticlePage({ article, articles }: Props) {
  return (
    <>
      <ArticleFeature data={article} articles={articles} />
      <div className="mt-5">
        <AdUnit slot="5969933704" />
      </div>
    </>
  );
}
