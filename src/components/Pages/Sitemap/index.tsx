import { Article, Category } from '@/libs/microcms';
import DisplayAd from '@/components/Common/ ThirdParties/GoogleAdSense/Elements/AdUnit';
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
      <DisplayAd slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
