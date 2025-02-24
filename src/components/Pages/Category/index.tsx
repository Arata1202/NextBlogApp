import { Article, Category } from '@/libs/microcms';
import PageHeading from '@/components/Common/PageHeading';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Display from '@/components/Common/ThirdParties/GoogleAdSense/Elements/AdUnit';

type Props = {
  articles: Article[];
  category: Category;
  current?: number;
  totalCount: number;
  recentArticles?: Article[];
};

export default function CategoryPage({
  articles,
  category,
  totalCount,
  recentArticles,
  current,
}: Props) {
  return (
    <>
      <PageHeading category={category} />
      <ArticleList articles={articles} recentArticles={recentArticles} />
      <Pagination totalCount={totalCount} current={current} basePath={`/category/${category.id}`} />
      <Sidebar recentArticles={recentArticles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
