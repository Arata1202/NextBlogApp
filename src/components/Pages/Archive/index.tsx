import { Article } from '@/libs/microcms';
import Display from '@/components/Common/Adsense/Display';
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
  allArticles?: Article[];
};

export default function ArchivePage({
  year,
  month,
  articles,
  totalCount,
  current,
  allArticles,
}: Props) {
  return (
    <>
      <PageHeading year={year} month={month} />
      <ArticleList articles={articles} allArticles={allArticles} />
      <Pagination
        totalCount={totalCount}
        current={current}
        basePath={`/archive/${year}/${month}`}
      />
      <Sidebar allArticles={allArticles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
