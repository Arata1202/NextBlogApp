import { LinkIcon } from '@heroicons/react/20/solid';
import ArticleCard from '@/components/Common/ArticleCard';
import type { ContentBlock, IntroductionBlock } from '@/types/microcms';

type Props = {
  block: ContentBlock | IntroductionBlock;
};

export default function WantToRead({ block }: Props) {
  if (!block.article_link || typeof block.article_link === 'string') {
    return null;
  }

  return (
    <>
      <div className="flex mt-10">
        <LinkIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        <div className="text-2xl font-semibold mb-5">あわせて読みたい</div>
      </div>
      <ArticleCard article={block.article_link} />
    </>
  );
}
