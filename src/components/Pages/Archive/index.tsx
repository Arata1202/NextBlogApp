import { Article } from '@/libs/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import PageHeading from '@/components/Common/PageHeading';
import Sidebar from '@/components/Common/Layouts/Sidebar';

type Props = {
  year: string;
  month: string;
  articles: Article[];
  totalCount: number;
  current?: number;
  recentArticles?: Article[];
};

export default function ArchivePage({
  year,
  month,
  articles,
  totalCount,
  current,
  recentArticles,
}: Props) {
  return (
    <>
      <PageHeading year={year} month={month} />
      <ArticleList articles={articles} recentArticles={recentArticles} />
      <Pagination
        totalCount={totalCount}
        current={current}
        basePath={`/archive/${year}/${month}`}
      />
      <Sidebar recentArticles={recentArticles} mobile={true} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
