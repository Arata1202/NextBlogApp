import { Article, Tag } from '@/libs/microcms';
import PageHeading from '@/components/Common/PageHeading';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import DisplayAd from '@/components/Common/ ThirdParties/GoogleAdSense/Elements/AdUnit';

type Props = {
  articles: Article[];
  tag: Tag;
  current?: number;
  totalCount: number;
  recentArticles?: Article[];
};

export default function TagPage({ articles, tag, totalCount, recentArticles, current }: Props) {
  return (
    <>
      <PageHeading tag={tag} />
      <ArticleList articles={articles} recentArticles={recentArticles} />
      <Pagination totalCount={totalCount} current={current} basePath={`/tag/${tag.id}`} />
      <Sidebar recentArticles={recentArticles} mobile={true} />
      <DisplayAd slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
