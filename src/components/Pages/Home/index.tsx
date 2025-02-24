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
  recentArticles?: Article[];
};

export default function HomePage({ articles, totalCount, recentArticles, current }: Props) {
  return (
    <>
      <PageHeading home={true} />
      <ArticleList articles={articles} recentArticles={recentArticles} />
      <Pagination totalCount={totalCount} current={current} />
      <Sidebar recentArticles={recentArticles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
