import { LinkIcon } from '@heroicons/react/20/solid';
import { Article } from '@/types/microcms';
import ArticleCard from '@/components/Common/ArticleCard';

type Props = {
  relatedArticles: Article[];
};

export default function RelatedArticle({ relatedArticles }: Props) {
  return (
    <>
      <div className="mt-5">
        <div className={`text-2xl font-semibold flex justify-center`}>
          <LinkIcon className="h-8 w-8 mr-2" />
          関連記事
        </div>
        <div className="mt-5">
          {relatedArticles.map((item) => (
            <ArticleCard key={item.id} article={item} />
          ))}
        </div>
      </div>
    </>
  );
}
