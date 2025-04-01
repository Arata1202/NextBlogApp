import { Article, Tag } from '@/types/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  year: string;
  month: string;
  articles: Article[];
  totalCount: number;
  current?: number;
  recentArticles?: Article[];
  tags: Tag[];
};

export default function ArchivePage({
  year,
  month,
  articles,
  totalCount,
  current,
  recentArticles,
  tags,
}: Props) {
  return (
    <>
      <PageHeading year={year} month={month} />
      <ArticleList articles={articles} recentArticles={recentArticles} tags={tags} />
      <Pagination
        totalCount={totalCount}
        current={current}
        basePath={`/archive/${year}/${month}`}
      />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
