import { Article } from '@/libs/microcms';
import Display from '@/components/Adsense/Display';
import Pagination from '@/components/Layouts/Pagination';
import ArticleList from '@/components/ArticleLists/ArticleList';
import TopSidebar from '@/components/Sidebars/TopSidebar';
import PageHeading from '@/components/Common/Layouts/PageHeading';

type Props = {
  year: string;
  month: string;
  articles: Article[];
  totalCount: number;
  current?: number;
};

export default function ArchivePage({ year, month, articles, totalCount, current }: Props) {
  return (
    <>
      <PageHeading year={year} month={month} />
      <ArticleList articles={articles} />
      <Pagination
        totalCount={totalCount}
        current={current}
        basePath={`/archive/${year}/${month}`}
      />
      <div className="pc">
        <TopSidebar />
      </div>
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
