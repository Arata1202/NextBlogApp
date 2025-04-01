import { Article, Tag } from '@/types/microcms';
import PageHeading from '@/components/Common/PageHeading';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';

type Props = {
  articles: Article[];
  tag: Tag;
  current?: number;
  totalCount: number;
  recentArticles?: Article[];
  tags: Tag[];
};

export default function TagPage({
  articles,
  tag,
  totalCount,
  recentArticles,
  current,
  tags,
}: Props) {
  return (
    <>
      <PageHeading tag={tag} />
      <ArticleList articles={articles} recentArticles={recentArticles} tags={tags} />
      <Pagination totalCount={totalCount} current={current} basePath={`/tag/${tag.id}`} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
