import { Article, Category } from '@/libs/microcms';
import Display from '@/components/Common/ThirdParties/GoogleAdSense/Display';
import SitemapFeature from '@/components/Features/Sitemap';
import PageHeading from '@/components/Common/PageHeading';
import Sidebar from '@/components/Common/Layouts/Sidebar';

type Props = {
  articles: Article[];
  categories: Category[];
};

export default function SitemapPage({ articles, categories }: Props) {
  return (
    <>
      <PageHeading sitemap={true} />
      <SitemapFeature articles={articles} categories={categories} />
      <Sidebar recentArticles={articles} mobile={true} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
