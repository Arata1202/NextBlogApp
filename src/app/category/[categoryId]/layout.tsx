import { serializeJsonLd } from '@/utils/jsonLd';
import { DEFAULT_PREVIEW_IMAGE, getSiteUrl, getSiteTitle } from '@/config/site';
import { Metadata } from 'next';
import { getCategoryForPage, taxonomyFields } from '@/libs/microcmsPage';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    categoryId: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const category = await getCategoryForPage(params.categoryId, taxonomyFields);

  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();

  const title = `${category.name}｜${defaultTitle}`;
  const description = `${category.name}について解説するカテゴリーです。`;
  const images = `${defaultUrl}${DEFAULT_PREVIEW_IMAGE}`;
  const url = `${defaultUrl}/category/${category.id}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: images,
      url: url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CategoryLayout(props: Props) {
  const params = await props.params;
  const category = await getCategoryForPage(params.categoryId, taxonomyFields);
  const { children } = props;
  const defaultUrl = getSiteUrl();
  const categoryUrl = `${defaultUrl}/category/${category.id}`;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: defaultUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
        item: categoryUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
