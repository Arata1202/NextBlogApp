import { serializeJsonLd } from '@/utils/jsonLd';
import { getSiteUrl, getSiteTitle } from '@/config/site';
import { Metadata } from 'next';
import { PROFILE_NAME, SOCIAL_ICON } from '@/constants/data';
import { getArticleDetailForPage } from '@/libs/microcmsPage';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await getArticleDetailForPage(params.slug);

  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();

  const title = `${data.title}｜${defaultTitle}`;
  const description = `${data.description}`;
  const images = `${data.thumbnail.url}`;
  const url = `${defaultUrl}/articles/${data.id}`;

  return {
    title: title,
    description: description,
    openGraph: {
      type: 'article',
      title: title,
      description: description,
      images: images,
      url: url,
      publishedTime: data.publishedAt,
      modifiedTime: data.updatedAt,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticleLayout(props: Props) {
  const params = await props.params;
  const data = await getArticleDetailForPage(params.slug);
  const { children } = props;

  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();
  const articleUrl = `${defaultUrl}/articles/${data.id}`;
  const keywords = data.tags
    ?.map((tag) => tag.name)
    .filter(Boolean)
    .join(', ');

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${articleUrl}#blogposting`,
    url: articleUrl,
    headline: data.title,
    description: data.description,
    image: data.thumbnail.url,
    inLanguage: 'ja-JP',
    articleSection: data.categories
      ?.map((category) => category.name)
      .filter(Boolean)
      .join(', '),
    keywords: keywords || undefined,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt,
    author: {
      '@type': 'Person',
      '@id': `${defaultUrl}/profile#person`,
      name: PROFILE_NAME,
      url: `${defaultUrl}/profile`,
      sameAs: SOCIAL_ICON.map((icon) => icon.path),
    },
    publisher: {
      '@type': 'Organization',
      name: defaultTitle,
      logo: {
        '@type': 'ImageObject',
        url: `${defaultUrl}/images/head/realstudent.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  const category = data.categories?.[0];
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
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: category.name,
              item: `${defaultUrl}/category/${category.id}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 3 : 2,
        name: data.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
