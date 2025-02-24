import { Article } from '@/libs/microcms';
import Display from '@/components/Common/Adsense/Display';
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
        <Display slot="5969933704" />
      </div>
    </>
  );
}
