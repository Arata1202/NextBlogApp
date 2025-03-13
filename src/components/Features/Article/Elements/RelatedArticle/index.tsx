import { LinkIcon } from '@heroicons/react/20/solid';
import { Article } from '@/types/microcms';
import ArticleCard from '@/components/Common/ArticleCard';

type Props = {
  data: Article;
};

export default function RelatedArticle({ data }: Props) {
  return (
    <>
      <div className="mt-5">
        <div className={`text-2xl font-semibold flex justify-center`}>
          <LinkIcon className="h-8 w-8 mr-2" />
          関連記事
        </div>
        <div className="mt-5">
          {data.related_articles.map((block, index) => (
            <div key={index}>
              {block.article_link && typeof block.article_link !== 'string' && (
                <ArticleCard article={block.article_link} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
