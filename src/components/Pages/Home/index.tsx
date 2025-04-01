import { Article, Tag } from '@/types/microcms';
import PageHeading from '@/components/Common/PageHeading';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';

type Props = {
  articles: Article[];
  current?: number;
  totalCount: number;
  recentArticles?: Article[];
  tags: Tag[];
};

export default function HomePage({ articles, totalCount, recentArticles, current, tags }: Props) {
  return (
    <>
      <PageHeading home={true} />
      <ArticleList articles={articles} recentArticles={recentArticles} tags={tags} />
      <Pagination totalCount={totalCount} current={current} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
