import { Article, Category } from '@/types/microcms';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import SitemapHtmlFeature from '@/components/Features/SitemapHtml';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  articles: Article[];
  categories: Category[];
};

export default function SitemapHtmlPage({ articles, categories }: Props) {
  return (
    <>
      <PageHeading sitemap={true} />
      <SitemapHtmlFeature articles={articles} categories={categories} />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
