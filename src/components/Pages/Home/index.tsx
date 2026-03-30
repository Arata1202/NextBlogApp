import { Article, Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import PageHeading from '@/components/Common/PageHeading';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import { UnifiedArticle } from '@/types/unified';

type Props = {
  articles: Article[];
  current?: number;
  totalCount: number;
  recentArticles?: UnifiedArticle[];
  tags: Tag[];
  archiveList: ArchiveItem[];
  mixedArticles?: UnifiedArticle[];
};

export default function HomePage({
  articles,
  totalCount,
  recentArticles,
  current,
  tags,
  archiveList,
  mixedArticles,
}: Props) {
  return (
    <>
      <PageHeading home={true} />
      <ArticleList
        articles={articles}
        mixedArticles={mixedArticles}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
      <Pagination totalCount={totalCount} current={current} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
