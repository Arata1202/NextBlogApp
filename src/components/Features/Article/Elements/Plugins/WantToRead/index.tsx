import { LinkIcon } from '@heroicons/react/20/solid';
import ArticleCard from '@/components/Common/ArticleCard';

type Props = {
  block: any;
};

export default function WantToRead({ block }: Props) {
  return (
    <>
      <div className="flex mt-10">
        <LinkIcon className="h-8 w-8 mr-2" />
        <div className="text-2xl font-semibold mb-5">あわせて読みたい</div>
      </div>
      <ArticleCard article={block.article_link} />
    </>
  );
}
