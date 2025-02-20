import { Article } from '@/libs/microcms';
import PageHeading from '@/components/Common/PageHeading';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Display from '@/components/Common/Adsense/Display';

type Props = {
  articles: Article[];
  current?: number;
  totalCount: number;
  allArticles?: Article[];
};

export default function HomePage({ articles, totalCount, allArticles, current }: Props) {
  return (
    <>
      <PageHeading home={true} />
      <ArticleList articles={articles} allArticles={allArticles} />
      <Pagination totalCount={totalCount} current={current} />
      <Sidebar allArticles={allArticles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
