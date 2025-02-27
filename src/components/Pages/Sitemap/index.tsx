import { Article, Category } from '@/libs/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import SitemapFeature from '@/components/Features/Sitemap';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  articles: Article[];
  categories: Category[];
};

export default function SitemapPage({ articles, categories }: Props) {
  return (
    <>
      <PageHeading sitemap={true} />
      <SitemapFeature articles={articles} categories={categories} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
